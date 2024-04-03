const { Router } = require("express");
const passport = require("passport");
const CurrentUserDTO = require("../DTOs/current-user.dto");

const router = Router();

// Enviar la información del usuario que que está autenticado
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

module.exports = router;

// const { Router } = require("express");
// const passport = require("passport");

// const router = Router();

// // Si el usuario está autenticado correctamente, se devolverá la información del usuario 
// router.get(
//   "/current",
//   // Aplicar el middleware 
//   passport.authenticate("current", { session: false }),
//   (req, res) => {
//     try {
//       // En este punto, el usuario actual está autenticado y disponible en req.user
//       res.json(req.user); // Devuelve el usuario actual en una respuesta JSON
//     } catch (error) {
//       req.logger.error(error);
//     }
//   }
// );

// module.exports = router;


