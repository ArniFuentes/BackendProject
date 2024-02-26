// const { useValidPassword } = require("../utils/bcrypt-password.util");
// const Users = require("../models/user.model");
const { Router } = require("express");
const passport = require("passport");
const generateToken = require("../utils/jwt.util");

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    try {
      // Obteniendo el usuario autenticado desde req.user
      const user = req.user;

      const tokenInfo = {
        id: user._id,
        role: user.role,
      };
      const token = generateToken(tokenInfo);
      // Enviar el token en una cookie
      res
        .cookie("authToken", token, { httpOnly: true })
        .json({ message: "Logged" });

    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "success", message: "Internal Server Error" });
    }
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] })
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { session: false }),
  // Si es exitoso
  (req, res) => {
    try {
      const user = JSON.stringify(req.user);
      const token = generateToken(user);
      res
        .cookie("authToken", token, { httpOnly: true })
        .json({ message: "Logged" });

    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await Users.findOne({ email });

//     // No existe el email?
//     if (!user) {
//       return res.status(400).json({ error: "Bad request" });
//     }

//     // No es válido el password?
//     if (!useValidPassword(user, password)) {
//       return res.status(400).json({ error: "Bad request" });
//     }

//     const tokenInfo = {
//       id: user._id,
//       role: user.role,
//     };

//     const token = generateToken(tokenInfo);

//     res.cookie("authToken", token).json({ message: "Logged" });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ status: "success", message: "Internal Server Error" });
//   }
// });
