const { Router } = require("express");
const passport = require("passport");
const usersService = require("../services/users.service");
const authRoleMiddleware = require("../middlewares/auth-role.middlewares");

const router = Router();

router.get(
  "/",
  // Proceso de autorización
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const users = await usersService.getAll();
      res.json({ message: users });
    } catch (error) {
      console.log(error);
    }
  }
);

// Ruta protegida
router.get(
  "/:uid",
  // Proceso de autorización
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await usersService.getOne(uid);
      res.json({ message: user });
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "Error", error: "Internal Server Error" });
    }
  }
);

module.exports = router;
