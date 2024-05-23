import jwt from "jsonwebtoken";
import config from "../configs/config.js";
import UserRepository from "../repositories/users.repository.js";
import generateToken from "../utils/jwt.util.js";
import transport from "../utils/nodemailer.util.js";
import { createHash, useValidPassword } from "../utils/bcrypt-password.util.js";

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
  // Configurar el correo electrónico
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

  await transport.sendMail(mailOptions);
};

async function resetPassword(token, newPassword) {
  try {
    const tokenCredentials = jwt.verify(token, config.secret);
    const user = await userRepository.findOne({ _id: tokenCredentials.id });

    if (!user) {
      return { status: 404, message: "User not found" };
    }

    if (useValidPassword(user, newPassword)) {
      return { status: 400, message: "New password must be different" };
    }

    user.password = createHash(newPassword);
    await userRepository.save(user);

    return { status: 200, message: "Password reset successfully" };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal Server Error" };
  }
}

export default {
  getToken,
  updateLastConnection,
  sendResetPasswordEmail,
  resetPassword,
};
