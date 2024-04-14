const { Router } = require("express");
const passport = require("passport");
const usersService = require("../services/users.service");
const authRoleMiddleware = require("../middlewares/auth-role.middlewares");
const transport = require("../utils/nodemailer.util");
const { emailUser } = require("../configs/config");

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
      res.json({ error });
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
        from: emailUser,
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

module.exports = router;
