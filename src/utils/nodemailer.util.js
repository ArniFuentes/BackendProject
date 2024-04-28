import nodeMailer from "nodemailer";
import config from "../configs/config.js";

const transport = nodeMailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});

export default transport;
