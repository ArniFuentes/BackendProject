import mongoose from "mongoose";
import getLogger from "../utils/winston/factory.js";
import config from "../configs/config.js";

const mongoConnect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${config.dbUser}:${config.dbPassword}@${config.dbHost}/${config.dbName}?retryWrites=true&w=majority&appName=Cluster0`
      // "mongodb://localhost:27017/test_coder"
    );
    getLogger.info("DB is connected");
  } catch (error) {
    console.log(error);
  }
};

export default mongoConnect;
