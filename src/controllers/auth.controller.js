// Controlador de autenticación (Login)

const { useValidPassword } = require("../utils/crypt-password.util");

const { Router } = require("express");
const Users = require("../models/user.model");
const passport = require("passport");

const router = Router();

// Crear una sesión
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/auth/fail-login" }),
  async (req, res) => {
    try {
      console.log(req.user)
      // Crear la sesión de un usuario
      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role,
      };

      // // Redireccionar al perfil después de iniciar sesión
      res.json({ status: "Success", message: "Logged" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "success", message: "Internal Server Error" });
    }
  }
);

router.get("/fail-login", (req, res) => {
  res.json({ status: "error", error: "Login failed" });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.json({ error: err });
    }
    res.redirect("/login");
  });
});

router.get(
  "/github",
  // Utilizar la estrategia github del passport.config.js
  passport.authenticate("github", { scope: ["user: email"] }, (req, res) => {})
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

module.exports = router;
