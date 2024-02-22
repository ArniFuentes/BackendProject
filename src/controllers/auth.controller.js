// Controlador de autenticación (Login)

const { useValidPassword } = require("../utils/crypt-password.util");

const { Router } = require("express");
const Users = require("../models/user.model");
const passport = require("passport");

const router = Router();

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });

      // No existe el email?
      if (!user) {
        return res.status(400).json({ error: "Bad request"});
      }
      // // Crear la sesión de un usuario
      // req.session.user = {
      //   first_name: req.user.first_name,
      //   last_name: req.user.last_name,
      //   email: req.user.email,
      //   role: req.user.role,
      // };


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
