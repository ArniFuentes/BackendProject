const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.render("profile.handlebars");
});

router.get("/login", (req, res) => {
  res.render("login.handlebars");
});

router.get("/signup", (req, res) => {
  res.render("signup.handlebars");
});

module.exports = router;
