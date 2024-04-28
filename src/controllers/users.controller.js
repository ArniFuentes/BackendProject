import { Router } from "express";
import passport from "passport";
import usersService from "../services/users.service.js";
import authRoleMiddleware from "../middlewares/auth-role.middlewares.js";
import transport from "../utils/nodemailer.util.js";
import config from "../configs/config.js";

const router = Router();

router.get(
  "/",
  // Validar las credenciales
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const users = await usersService.getAll();
      res.json({ message: users });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/:uid",
  // Validar las credenciales
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await usersService.getOne(uid);
      res.json({ message: user });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error });
    }
  }
);

router.post(
  "/",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    try {
      // Se creó el recurso en la base de datos
      res.status(201).json({ status: "success", message: "registered user" });

      // Enviar el correo electrónico
      const mailOptions = {
        from: config.emailUser,
        to: req.body.email, // Tomar el correo del usuario registrado
        subject: "Registro exitoso!!",
        html: "<h1>¡Gracias por registrarte!</h1>",
      };

      await transport.sendMail(mailOptions);
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ status: "Error", error: "Internal Server Error" });
    }
  }
);

export default router;
