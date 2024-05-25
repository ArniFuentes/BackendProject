import passport from "passport";
import { Router } from "express";
import authRoleMiddleware from "../middlewares/auth-role.middlewares.js";

const router = Router();

router.get(
  "/",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["user"]),
  (req, res) => {
    res.render("chat.handlebars");
  }
);

export default router;
