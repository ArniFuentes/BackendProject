import mongoose from "mongoose";
import logger from "../utils/winston/factory.js";
import config from "../configs/config.js";

const mongoConnect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${config.dbUser}:${config.dbPassword}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority&appName=Cluster0`
      
    );
    logger.info("DB is connected");
  } catch (error) {
    logger.info(error);
  }
};

export default mongoConnect;
