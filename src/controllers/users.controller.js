const { Router } = require("express");
const passport = require("passport");
const Users = require("../models/user.model");

const router = Router();

router.get(
  "/",
  // Endpoint protegido
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const users = await Users.find();
      res.json({ message: users });

    } catch (error) {
      console.log(error);
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

    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Error", error: "Internal Server Error" });
    }
  }
);

module.exports = router;
