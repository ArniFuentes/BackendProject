const mongoose = require("mongoose");
const { dbUser, dbPassword, dbHost, dbName } = require("../configs/config");

const mongoConnect = async () => {
  try {
    await mongoose.connect(
      // Utilizar las variables de entorno
      `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`
    );
    console.log("DB is connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoConnect;
