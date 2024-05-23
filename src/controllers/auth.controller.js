import { Router } from "express";
import passport from "passport";
import authService from "../services/auth.service.js";
import usersService from "../services/users.service.js";

const router = Router();

// Iniciar sesión
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
      req.logger.error(error);
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
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
      // .json({ message: "Logged" });
      res.redirect("/index.html");
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Manejar las solicitudes de restablecimiento de contraseña
router.post("/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usersService.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = authService.getToken(user);
    await authService.sendResetPasswordEmail(user, token); 

    res.status(201).json({ status: "Email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Ruta para manejar el restablecimiento de contraseña
router.post("/resetPassword/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const { password } = req.body;

    const result = await authService.resetPassword(token, password);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/fail-login", (req, res) => {
  res.json({ status: "error", error: "Login failed" });
});

export default router;
