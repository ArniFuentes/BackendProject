import dotenv from "dotenv";

dotenv.config();

const config = {
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  ghClientId: process.env.GH_CLIENT_ID,
  ghClientSecret: process.env.GH_CLIENT_SECRET,
  secret: process.env.SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  base_url: process.env.BASE_URL,
};

export default config;
