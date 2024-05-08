import { Router } from "express";
import passport from "passport";
import usersService from "../services/users.service.js";
import authRoleMiddleware from "../middlewares/auth-role.middlewares.js";
import transport from "../utils/nodemailer.util.js";
import config from "../configs/config.js";
import upload from "../utils/multerConfig.js"; // Importa el middleware de Multer
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = Router();

router.get(
  "/",
  // Validar las credenciales
  passport.authenticate("current", { session: false }),
  authRoleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const users = await usersService.getAll();
      res.json({ message: users });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get(
  "/:uid",
  // Validar las credenciales
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await usersService.getOne(uid);
      res.json({ message: user });
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ error });
    }
  }
);

router.post(
  "/",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    try {
      // Se creó el recurso en la base de datos
      res.status(201).json({ status: "success", message: "registered user" });

      // Enviar el correo electrónico
      const mailOptions = {
        from: config.emailUser,
        to: req.body.email, // Tomar el correo del usuario registrado
        subject: "Registro exitoso!!",
        html: "<h1>¡Gracias por registrarte!</h1>",
      };

      await transport.sendMail(mailOptions);
    } catch (error) {
      req.logger.error(error);
      res.status(500).json({ status: "Error", error: "Internal Server Error" });
    }
  }
);

// // Definir la ruta para cambiar el rol de un usuario
// router.put(
//   "/premium/:uid",
//   passport.authenticate("current", { session: false }),
//   // solo los usuarios con roles de "user" y "premium" podrían acceder a la ruta
//   authRoleMiddleware(["user", "premium"]),
//   async (req, res, next) => {
//     try {
//       const userId = req.params.uid;

//       // Llamar al servicio para cambiar el rol del usuario
//       await usersService.toggleUserRole(userId);

//       res
//         .status(200)
//         .json({ message: "Rol de usuario actualizado exitosamente." });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// Definir la ruta para cambiar el rol de un usuario a premium
router.put(
  "/premium/:uid",
  passport.authenticate("current", { session: false }),
  // solo los usuarios con roles de "user" y "premium" podrían acceder a la ruta
  authRoleMiddleware(["user", "premium"]),
  async (req, res) => {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const userId = req.params.uid;

      // Ruta a la carpeta documents
      const directorio = path.join(
        __dirname,
        "..",
        "public",
        "uploads",
        "documents"
      );

      fs.readdir(directorio, async (err, archivos) => {
        if (err) {
          console.error("Error al leer la carpeta:", err);
          return;
        }

        // Filtra los archivos para obtener solo los que contienen el ID del usuario en el nombre
        const userFiles = archivos.filter((file) => file.includes(userId));

        // Obtiene los nombres de los archivos
        const fileNames = userFiles.map((file) => {
          // Encontrar la posición del segundo guion bajo '_'
          const primerGuionBajoIndex = file.indexOf("_");
          const segundoGuionBajoIndex = file.indexOf(
            "_",
            primerGuionBajoIndex + 1
          );

          const namePlusExtensionList = file.substring(
            segundoGuionBajoIndex + 1
          );
          const nameWithoutExtension = namePlusExtensionList.slice(0, -4);
          return nameWithoutExtension;
        });

        // Verificar si el usuario ha cargado todos los documentos necesarios
        const requiredDocuments = [
          "identification",
          "proof_of_address",
          "bank_statement",
        ];

        const hasAllRequiredDocuments = requiredDocuments.every((doc) =>
          fileNames.includes(doc)
        );

        if (!hasAllRequiredDocuments) {
          return res.status(400).json({
            error: "No ha cargado todos los documentos necesarios.",
          });
        }
        // Llamar al servicio para cambiar el rol del usuario
        await usersService.toggleUserRole(userId);
        res
          .status(200)
          .json({ message: "Rol de usuario actualizado exitosamente." });
      });
    } catch (error) {
      // next(error);
      console.log(error);
    }
  }
);

// Ruta para subir documentos
router.post(
  "/:uid/documents",
  passport.authenticate("current", { session: false }),
  upload.any(), // Utiliza el middleware de Multer para manejar la subida de archivos
  async (req, res) => {
    try {
      // const uploadedDocuments = req.files; // Array de objetos con los archivos subidos
      // console.log(uploadedDocuments);
      res.status(200).json({ message: "Documentos subidos exitosamente" });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
);

export default router;
