const express = require("express");
const handlebars = require("express-handlebars");
const router = require("./router/index");
const mongoConnect = require("./db/index");
const initializePassport = require("./configs/passport.config");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errors/index");

const app = express();

app.use(express.json());
app.use(cookieParser());  // para obtener las cookies

app.use(express.urlencoded({ extended: true })); // Datos del formulario a objeto

// configura el middleware express.static para servir archivos estáticos desde "public" dentro de "src"
app.use(express.static(process.cwd() + "/src/public")); // Buscar el /js/chat.js en la carpeta public

// Ejecutar las configuraciones
initializePassport();
app.use(passport.initialize());

// Configurar handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", process.cwd() + "/src/views"); // Ruta de las plantillas

app.use(express.urlencoded({ extended: true })); // Para pasar a objeto lo que venga de formulario

router(app);
app.use(errorMiddleware);

mongoConnect();

module.exports = app;
