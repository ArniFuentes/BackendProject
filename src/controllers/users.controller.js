// Logica para almacenar los usuarios que hace el registro

// const { createHash } = require("../utils/crypt-password.util");

const { Router } = require("express");
// const Users = require("../models/user.model");
const passport = require("passport");

const router = Router();

router.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/users/fail-register",
  }),
  async (req, res) => {
    try {
      // Se creó el recurso en la base de datos
      res.status(201).json({ status: "success", message: "registered user" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Error", error: "Internal Server Error" });
    }
  }
);

router.get("/fail-register", (req, res) => {
  console.log("Falló registro");
  res.status(400).json({ status: "error", error: "Bad request" });
});

module.exports = router;