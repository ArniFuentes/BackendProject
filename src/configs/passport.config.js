const passport = require("passport");
const jwt = require("passport-jwt");

const { secret } = require("./config");
const extractJwtCookie = require("../utils/extract-jwt-cookie.util");

const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

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
};

module.exports = initializePassport;
