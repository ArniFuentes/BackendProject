// Para leer variables de entorno desde el .env
require("dotenv").config();

module.exports = {
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  sessionDbName: process.env.SESSION_DB_NAME,

  ghClientId: process.env.GH_CLIENT_ID,
  ghClientSecret: process.env.GH_CLIENT_SECRET,
  secret: process.env.SECRET,
};
