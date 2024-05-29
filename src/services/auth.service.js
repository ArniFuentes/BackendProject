import jwt from "jsonwebtoken";
import config from "../configs/config.js";
import UserRepository from "../repositories/users.repository.js";
import generateToken from "../utils/jwt.util.js";
import transport from "../utils/nodemailer.util.js";
import { createHash, useValidPassword } from "../utils/bcrypt-password.util.js";
import logger from "../utils/winston/factory.js";
import HttpError from "../utils/HttpError.js";
import HTTP_RESPONSES from "../constants/http-responses.contant.js";

const userRepository = new UserRepository();

const getToken = (user) => {
  try {
    const tokenInfo = {
      id: user._id,
      first_name: user.first_name,
      email: user.email,
      role: user.role,
    };
      
    const token = generateToken(tokenInfo);
    return token;
  } catch (error) {
    throw new Error("Error handling login");
  }
};

const updateLastConnection = async (user) => {
  user.last_connection = new Date();
  await userRepository.save(user);
};

const sendResetPasswordEmail = async (user, resetToken) => {
  const mailOptions = {
    from: config.emailUser,
    to: user.email,
    subject: "Recuperación de Contraseña",
    html: `
    <p>Hola ${user.first_name},</p>
    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
    <a href="http://localhost:8080/resetPassword.html?token=${resetToken}"><button>Restablecer Contraseña</button></a>
    <p>Este enlace expirará en 1 hora.</p>
    <p>Si no solicitaste restablecer tu contraseña, ignora este correo electrónico.</p>
  `,
  };
  try {
    await transport.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

async function resetPassword(token, newPassword) {
  try {
    const tokenCredentials = jwt.verify(token, config.secret);
    const user = await userRepository.findOne({ _id: tokenCredentials.id });

    if (!user) {
      throw new HttpError(
        HTTP_RESPONSES.NOT_FOUND,
        HTTP_RESPONSES.NOT_FOUND_CONTENT
      );
    }

    if (useValidPassword(user, newPassword)) {
      throw new HttpError(
        HTTP_RESPONSES.BAD_REQUEST,
        HTTP_RESPONSES.BAD_REQUEST_CONTENT
      );
    }

    user.password = createHash(newPassword);
    await userRepository.save(user);
  } catch (error) {
    throw error;
  }
}

export default {
  getToken,
  updateLastConnection,
  sendResetPasswordEmail,
  resetPassword,
};
