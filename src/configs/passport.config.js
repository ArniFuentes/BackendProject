const passport = require("passport");
const jwt = require("passport-jwt");
const local = require("passport-local");
const {
  createHash,
  useValidPassword,
} = require("../utils/crypt-password.util");
const Users = require("../models/user.model");
const GithubStrategy = require("passport-github2");
const { ghClientSecret, ghClientId, secret } = require("./config");
const extractJwtCookie = require("../utils/extract-jwt-cookie.util");

const JwtStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
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

// const LocalStrategy = local.Strategy; // Instanciar la clase

// const initializePassport = () => {
//   // Register es el nombre de la estrategia
//   passport.use(
//     "register", // Estrategia para registrar usuarios (nombre opcional)
//     new LocalStrategy(
//       // Primer argumento
//       { passReqToCallback: true, usernameField: "email" },
//       // Segundo argumento. username recibe un email (usernameField: "email")
//       async (req, username, password, done) => {
//         try {
//           const { first_name, last_name, email } = req.body;
//           const user = await Users.findOne({ email: username });
//           // Si existe el usuario
//           if (user) {
//             console.log("User exists");
//             return done(null, false);  // Rompe la ejecución
//           }

//           // Si es un nuevo usuario crearlo
//           const newUserInfo = {
//             first_name,
//             last_name,
//             email,
//             password: createHash(password),
//           };

//           // Crear el usuario en mongo
//           const newUser = await Users.create(newUserInfo);
//           console.log(newUser);
//           return done(null, newUser);
//         } catch (error) {
//           return done(error);
//         }
//       }
//     )
//   );

//   passport.use(
//     "login",
//     new LocalStrategy(
//       { usernameField: "email" },
//       async (username, password, done) => {
//         try {
//           const user = await Users.findOne({ email: username });

//           if (!user) {
//             console.log("Usuario no existe");
//             return done(null, false);  // No enviar el usuario (False)
//           }

//           if (!useValidPassword(user, password)) {
//             console.log("Password no hace match");
//             done(null, false);
//           }

//           return done(null, user);
//         } catch (error) {
//           done(error);
//         }
//       }
//     )
//   );

//   passport.use(
//     "github",
//     new GithubStrategy(
//       {
//         clientID: ghClientId,
//         clientSecret: ghClientSecret,
//         callbackURL: "http://localhost:8080/auth/githubcallback",
//       },
//       // Info obtenida desde github (la info del profile se guarda en la base)
//       async (accessToken, RefreshToken, profile, done) => {
//         try {
//           // console.log(profile);  // Ver lo que llega por consola

//           const { id, login, name, email } = profile._json;

//           const user = await Users.findOne({ email: email });
//           if (!user) {
//             const newUserInfo = {
//               first_name: name,
//               email,
//               githubId: id,
//               githubUsername: login,
//             };

//             const newUser = await Users.create(newUserInfo);
//             return done(null, newUser);
//           }

//           return done(null, user);
//         } catch (error) {
//           console.log(error);
//           done(error);
//         }
//       }
//     )
//   );

//   passport.serializeUser((user, done) => {
//     done(null, user._id);
//   });

//   passport.deserializeUser(async (id, done) => {
//     const user = Users.findById(id);
//     done(null, user);
//   });
// };

// module.exports = initializePassport;
