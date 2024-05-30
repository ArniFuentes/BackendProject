import { Router } from "express";
import passport from "passport";
import authService from "../services/auth.service.js";
import usersService from "../services/users.service.js";
import { getLogger } from "nodemailer/lib/shared/index.js";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";
import HttpError from "../utils/HttpError.js";

const router = Router();

// Iniciar sesión para obtener un token JWT válido 
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/auth/fail-login",
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user;
      await authService.updateLastConnection(user);
      // Actualizar la última conexión y generar el token en el servicio
      const token = authService.getToken(user);
      res
        .cookie("authToken", token, { httpOnly: true })
        .json({ message: "Logged" });
    } catch (error) {
      if (error instanceof HttpError) {
        return res
          .status(error.statusCode)
          .json({ status: "error", error: error.message });
      }
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
    }
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }, (req, res) => {}) // el user que llegue va a ser el email (en este caso)
);

// Github redirige a /auth/githubcallback
router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  // Si es exitoso pasar a la callback
  async (req, res) => {
    try {
      const user = req.user;
      const token = authService.getToken(user);

      res.cookie("authToken", token, { httpOnly: true });
      res.redirect("/index.html");
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

// Manejar las solicitudes de restablecimiento de contraseña
router.post("/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usersService.findOne({ email });
    const token = authService.getToken(user);
    await authService.sendResetPasswordEmail(user, token);
    res.json({ status: HTTP_RESPONSES.SUCCESS_CONTENT });
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message });
  }
});

// Ruta para manejar el restablecimiento de contraseña
router.post("/resetPassword/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const { password } = req.body;

    await authService.resetPassword(token, password);
    res.json({ status: HTTP_RESPONSES.SUCCESS_CONTENT });
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT });
  }
});

router.get("/fail-login", (req, res) => {
  res
    .status(HTTP_RESPONSES.UNAUTHORIZED)
    .json({ error: HTTP_RESPONSES.UNAUTHORIZED_CONTENT });
});

export default router;
