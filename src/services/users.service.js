// Utilizar el UserRepository en lugar del UserDAO directamente

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import config from "../configs/config.js";
import UserRepository from "../repositories/users.repository.js";
import transport from "../utils/nodemailer.util.js";
import UserDTO from "../DTOs/user.dto.js";
import HttpError from "../utils/HttpError.js";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";

const userRepository = new UserRepository();

const requiredDocuments = [
  "identification",
  "proof_of_address",
  "bank_statement",
];

const sendRegistrationEmail = async (email) => {
  try {
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "Registro exitoso!!",
      html: "<h1>¡Gracias por registrarte!</h1>",
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

// Cambio de roles de usuario
export const changeRole = async (userId) => {
  try {
    const user = await userRepository.findOne({ _id: userId });

    if (!user) {
      throw new Error("Usuario no encontrado.");
    }

    if (user.role === "user") {
      // Verificar documentos solo si el usuario es "user" y quiere ser "premium"
      await verifyUserDocuments(userId);
      user.role = "premium";
    } else {
      user.role = "user";
    }

    await userRepository.save(user);
  } catch (error) {
    // throw error;
    throw new Error("Error al cambiar el rol del usuario: " + error.message);
  }
};

const find = async () => {
  try {
    await userRepository.find();
  } catch (error) {
    throw error;
  }
};

const findOne = async (option) => {
  try {
    const user = await userRepository.findOne(option);
    if (!user) {
      throw new HttpError(
        HTTP_RESPONSES.BAD_REQUEST,
        HTTP_RESPONSES.BAD_REQUEST_CONTENT
      );
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const getInactiveUsers = async () => {
  try {
    const users = await userRepository.find();
    const currentTime = new Date();
    return users.filter((user) => {
      const millisecondsPerDay = 86400000;
      const differenceInDays = Math.floor(
        (currentTime - user.last_connection) / millisecondsPerDay
      );
      const days = 2;
      return differenceInDays >= days;
    });
  } catch (error) {
    throw error;
  }
};

const deleteOne = async (userId) => {
  try {
    await userRepository.deleteOne(userId);
  } catch (error) {
    throw error;
  }
};

const sendInactiveUserEmail = async (email) => {
  try {
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "Cuenta eliminada por inactividad",
      html: "<h1>Tu cuenta ha sido eliminada por inactividad</h1>",
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

const verifyUserDocuments = async (userId) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const directorio = path.join(
    __dirname,
    "..",
    "public",
    "uploads",
    "documents"
  );

  try {
    const archivos = await fs.promises.readdir(directorio);
    const userFiles = archivos.filter((file) => file.includes(userId));
    // Obtener los nombres de los archivos
    const fileNames = userFiles.map((file) => {
      const primerGuionBajoIndex = file.indexOf("_");
      const segundoGuionBajoIndex = file.indexOf("_", primerGuionBajoIndex + 1);
      const namePlusExtensionList = file.substring(segundoGuionBajoIndex + 1);
      return namePlusExtensionList.slice(0, -4);
    });

    const hasAllRequiredDocuments = requiredDocuments.every((doc) =>
      fileNames.includes(doc)
    );

    if (!hasAllRequiredDocuments) {
      throw new Error("No ha cargado todos los documentos necesarios.");
    }
  } catch (error) {
    throw new Error(
      "Error al verificar los documentos del usuario: " + error.message
    );
  }
};

async function findUsersExcludingAdmin() {
  const users = await find();
  const usersDTO = users.map(
    (user) => new UserDTO(user.first_name, user.email, user.role, user._id)
  );
  return usersDTO.filter((userDTO) => userDTO.role !== "admin");
}

export default {
  sendRegistrationEmail,
  changeRole,
  find,
  findOne,
  deleteOne,
  sendInactiveUserEmail,
  getInactiveUsers,
  verifyUserDocuments,
  findUsersExcludingAdmin,
};
