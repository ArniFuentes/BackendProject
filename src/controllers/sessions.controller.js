import { Router } from "express";
import passport from "passport";
import CurrentUserDTO from "../DTOs/current-user.dto.js";

const router = Router();

// Enviar la información del usuario que está autenticado
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    try {
      const currentUserDTO = new CurrentUserDTO(req.user);
      res.json({ user: currentUserDTO });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
