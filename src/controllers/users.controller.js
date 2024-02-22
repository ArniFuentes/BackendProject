// Logica para almacenar los usuarios que hace el registro

// const { createHash } = require("../utils/crypt-password.util");

const { Router } = require("express");
const passport = require("passport");
const Users = require("../models/user.model");
// const { authenticateMddlaware } = require("../utils/jwt.util");

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await Users.find();
      console.log(req.user);
      res.json({ message: users });
    } catch (error) {
      console.log(error);
    }
  }
);

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
