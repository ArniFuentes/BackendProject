import { Router } from "express";
import passport from "passport";
import userService from "../services/users.service.js";
import authRoleMiddleware from "../middlewares/auth-role.middlewares.js";
import upload from "../utils/multerConfig.js";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import HttpError from "../utils/HttpError.js";

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
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

router.get(
  "/:uid",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await userService.findOne({ _id: uid });
      res.json({ message: user });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

// Registrar un nuevo usuario
router.post(
  "/",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    try {
      res
        .status(HTTP_RESPONSES.CREATED)
        .json({ message: HTTP_RESPONSES.CREATED_CONTENT });
      await userService.sendRegistrationEmail(req.body.email);
    } catch (error) {
      req.logger.error(error);
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
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
      const user = await userService.findOne({ _id: userId });
      await userService.verifyUserDocuments(userId);
      await userService.changeRole(userId, user);
      res.json({ message: HTTP_RESPONSES.SUCCESS_CONTENT });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
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
      res.json({ message: HTTP_RESPONSES.SUCCESS_CONTENT });
    } catch (error) {
      res
        .status(HTTP_RESPONSES.BAD_REQUEST)
        .json({ error: HTTP_RESPONSES.BAD_REQUEST_CONTENT });
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
      await userService.removeInactiveUsers();
      res.json({ message: HTTP_RESPONSES.SUCCESS_CONTENT });
    } catch (error) {
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
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
      res.json({ message: HTTP_RESPONSES.SUCCESS_CONTENT });
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

export default router;
