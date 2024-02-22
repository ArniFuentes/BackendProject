const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const handlebars = require("express-handlebars");
const router = require("./router/index");
const mongoConnect = require("./db/index");
const { dbUser, dbPassword, dbHost, sessionDbName, } = require("./configs/config");
const initializePassport = require("./configs/passport.config");
const passport = require("passport");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Datos del formulario a objeto

// configura el middleware express.static para servir archivos estáticos desde "public" dentro de "src"
app.use(express.static(process.cwd() + "/src/public")); // Buscar el /js/chat.js en la carpeta public

// middleware de session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${sessionDbName}?retryWrites=true&w=majority`,
    }),
    secret: "ConLoQueQueramos",
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Configurar handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", process.cwd() + "/src/views"); // Ruta de las plantillas

app.use(express.urlencoded({ extended: true })); // Para pasar a objeto lo que venga de formulario

router(app);

mongoConnect();

module.exports = app;
