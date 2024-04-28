import { Router } from "express";
import passport from "passport";
import authRoleMiddleware from "../middlewares/auth-role.middlewares.js";
import usersService from "../services/users.service.js";

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

export default router;
