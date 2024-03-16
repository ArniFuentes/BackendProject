const mongoose = require("mongoose");
const { dbUser, dbPassword, dbHost, dbName } = require("../configs/config");

const mongoConnect = async () => {
  try {
    await mongoose.connect(
      // `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`
      "mongodb://localhost:27017/test_coder"
    );
    console.log("DB is connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoConnect;
