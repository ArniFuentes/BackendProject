import { Router } from "express";
import passport from "passport";
import CurrentUserDTO from "../DTOs/current-user.dto.js";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";

const router = Router();

// Enviar la información del usuario que está autenticado
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    try {
      const currentUserDTO = new CurrentUserDTO(req.user);
      res.status.json({ user: currentUserDTO });
    } catch (error) {
      req.logger.error(error);
      res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({
          status: "error",
          error: HTTP_RESPONSES.INTERNAL_SERVER_ERROR_CONTENT,
        });
    }
  }
);

export default router;
