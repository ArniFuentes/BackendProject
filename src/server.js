import express from "express";
import handlebars from "express-handlebars";
import router from "./router/index.js";
import mongoConnect from "./db/index.js";
import initializePassport from "./configs/passport.config.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import logger from "./middlewares/logger.midleware.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Documentation",
      description: "This is the documentation",
    },
  },
  // Ruta a los archivos que van a tener la documentación
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(cookieParser()); // para obtener las cookies
app.use(logger);

app.use(express.urlencoded({ extended: true })); // Datos del formulario a objeto

// configura el middleware express.static para servir archivos estáticos desde "public" dentro de "src"
app.use(express.static(process.cwd() + "/src/public")); // Buscar el /js/chat.js en la carpeta public

// Ejecutar las configuraciones
initializePassport();
app.use(passport.initialize());

// Configurar handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", process.cwd() + "/src/views"); // Ruta de las plantillas

app.use(express.urlencoded({ extended: true })); // Para pasar a objeto lo que venga de formularios

router(app);
// app.use(errorMiddleware);

mongoConnect();

export default app;
