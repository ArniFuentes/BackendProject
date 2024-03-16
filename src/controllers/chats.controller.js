const passport = require("passport");
const { Router } = require("express");
const authRoleMiddleware = require("../middlewares/auth-role.middlewares");

const router = Router();

router.get(
  "/",
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["user"]),
  (req, res) => {
    res.render("chat.handlebars");
  }
);

module.exports = router;
