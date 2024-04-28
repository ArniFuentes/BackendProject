import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login.handlebars");
});

router.get("/signup", (req, res) => {
  res.render("signup.handlebars");
});

export default router;
