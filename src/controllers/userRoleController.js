const { Router } = require("express");
const passport = require("passport");
const authRoleMiddleware = require("../middlewares/auth-role.middlewares");
const usersService = require("../services/users.service");

const router = Router();

// Definir la ruta para cambiar el rol de un usuario
router.put(
  "/premium/:uid",
  passport.authenticate("current", { session: false }),
  // solo los usuarios con roles de "user" y "premium" podrían acceder a la ruta
  authRoleMiddleware(["user", "premium"]),
  async (req, res, next) => {
    try {
      const userId = req.params.uid;

      // Llamar al servicio para cambiar el rol del usuario
      await usersService.toggleUserRole(userId);

      res
        .status(200)
        .json({ message: "Rol de usuario actualizado exitosamente." });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
