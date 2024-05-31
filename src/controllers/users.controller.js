import { Router } from "express";
import passport from "passport";
import userService from "../services/users.service.js";
import authRoleMiddleware from "../middlewares/auth-role.middlewares.js";
import upload from "../utils/multerConfig.js";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";

const router = Router();

// Obtener los usuarios
router.get(
  "/",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const filteredUsersDTO = await userService.findUsersExcludingAdmin();
      res.json({ message: filteredUsersDTO });
    } catch (error) {
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

router.get(
  "/:uid",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await userService.findOne(uid);
      res.status(200).json({ message: user });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error });
    }
  }
);

// Registrar un nuevo usuario
router.post(
  "/",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    try {
      res.status(201).json({ status: "success", message: "User registered" });
      await userService.sendRegistrationEmail(req.body.email);
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ status: "Error", error: "Internal Server Error" });
    }
  }
);

// Cambiar el rol de un usuario, de “user” a “premium” y viceversa
router.put(
  "/premium/:uid",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const userId = req.params.uid;

      await userService.verifyUserDocuments(userId);
      await userService.changeRole(userId);

      res
        .status(200)
        .json({ message: "Rol de usuario actualizado exitosamente." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Ruta para subir documentos
router.post(
  "/:uid/documents",
  passport.authenticate("current", { session: false }),
  upload.any(), // Utiliza el middleware de Multer para manejar la subida de archivos
  async (req, res) => {
    try {
      res.status(200).json({ message: "Documentos subidos exitosamente" });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
);

// Quitar los usuarios que no hayan tenido conexión en los últimos 2 días
router.delete(
  "/",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const inactiveUsers = await userService.getInactiveUsers();

      for (const user of inactiveUsers) {
        await userService.deleteOne(user._id);
        await userService.sendInactiveUserEmail(user.email);
      }

      res
        .status(200)
        .json({ message: "Usuarios inactivos eliminados correctamente" });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

router.delete(
  "/:uid",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin"]),
  async (req, res) => {
    try {
      await userService.deleteOne(req.params.uid);
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error });
    }
  }
);

export default router;
