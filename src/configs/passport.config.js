const passport = require("passport");
const jwt = require("passport-jwt");
const local = require("passport-local");
const { secret } = require("./config");
const extractJwtCookie = require("../utils/extract-jwt-cookie.util");
const Users = require("../models/user.model");
const { createHash } = require("../utils/crypt-password.util");

const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  // Capturar cualquier request que se realice
  passport.use(
    "jwt",
    new JwtStrategy(
      // Primer argumento
      {
        jwtFromRequest: ExtractJwt.fromExtractors([extractJwtCookie]),
        secretOrKey: secret,
      },
      // Segundo argumento
      (credentials, done) => {
        try {
          done(null, credentials);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "register", // Estrategia para registrar usuarios (nombre opcional)
    new LocalStrategy(
      // Primer argumento
      { passReqToCallback: true, usernameField: "email" },
      // Segundo argumento. username recibe un email (usernameField: "email")
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email } = req.body;
          const user = await Users.findOne({ email: username });
          // Si existe el usuario
          if (user) {
            console.log("User exists");
            return done(null, false); // Rompe la ejecución
          }

          // Si es un nuevo usuario crearlo
          const newUserInfo = {
            first_name,
            last_name,
            email,
            password: createHash(password),
          };

          // Crear el usuario en mongo
          const newUser = await Users.create(newUserInfo);
          console.log(newUser);
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
