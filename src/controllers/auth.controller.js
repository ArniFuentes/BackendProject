import { Router } from "express";
import passport from "passport";
import generateToken from "../utils/jwt.util.js";
import config from "../configs/config.js";
import transport from "../utils/nodemailer.util.js";
import jwt from "jsonwebtoken";
import { createHash, useValidPassword } from "../utils/bcrypt-password.util.js";

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      // Info a incluir en el token
      const tokenInfo = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      };
      const token = generateToken(tokenInfo);

      // Enviar el token en una cookie
      res
        .cookie("authToken", token, { httpOnly: true })
        .json({ message: "Logged" });
    } catch (error) {
      req.logger.error(error);
      res
        .status(500)
        .json({ status: "success", message: "Internal Server Error" });
    }
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] })
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { session: false }),
  // Si es exitoso
  async (req, res) => {
    try {
      const user = req.user;

      // Enviar el correo electrónico
      const mailOptions = {
        from: config.emailUser,
        to: user.email,
        subject: "Registro exitoso!!",
        html: "<h1>¡Gracias por registrarte!</h1>",
      };

      await transport.sendMail(mailOptions);

      const tokenInfo = {
        id: user._id,
        role: user.role,
      };
      const token = generateToken(tokenInfo);

      // Enviar el token en una cookie
      res
        .cookie("authToken", token, { httpOnly: true })
        .json({ message: "Logged" });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

import User from "../models/user.model.js";
// Manejar las solicitudes de restablecimiento de contraseña
router.post("/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;
    // Buscar en la base de datos si existe un usuario con el correo electrónico
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Si se encuentra un usuario con el correo electrónico generar el token de restablecimiento de contraseña
    const resetToken = jwt.sign({ userId: user._id }, config.secret, {
      expiresIn: "1h",
    });
    console.log(resetToken);

    // Configurar el correo electrónico
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "Recuperación de Contraseña",
      html: `
    <p>Hola ${user.first_name},</p>
    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
    <a href="http://localhost:8080/resetPassword.html?token=${resetToken}"><button>Restablecer Contraseña</button></a>
    <p>Este enlace expirará en 1 hora.</p>
    <p>Si no solicitaste restablecer tu contraseña, ignora este correo electrónico.</p>
  `,
    };

    await transport.sendMail(mailOptions);
    res.status(201).json({ status: "correo enviado" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Ruta para manejar el restablecimiento de contraseña
router.post("/resetPassword/:resetToken", async (req, res) => {
  try {
    const resetToken = req.params.resetToken;
    const decodedToken = jwt.verify(resetToken, config.secret);

    const { password } = req.body;

    // Buscar al usuario por el ID del token
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Si el nuevo password resulta válido es que el nuevo es el mismo actual
    if (useValidPassword(user, password)) {
      return res.status(200).json({
        message: "New password must be different",
      });
    }

    // Actualizar la contraseña del usuario
    user.password = createHash(password);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// router.get(
//   "/githubcallback",
//   passport.authenticate("github", { session: false }),
//   // Si es exitoso
//   (req, res) => {
//     try {
//       const user = JSON.stringify(req.user);
//       const token = generateToken(user);
//       res
//         .cookie("authToken", token, { httpOnly: true })
//         .json({ message: "Logged" });
//     } catch (error) {
//       req.logger.error(error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   }
// );

export default router;
