const nodeMailer = require("nodemailer");
const { emailUser, emailPassword } = require("../configs/config");

const transport = nodeMailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

module.exports = transport;
