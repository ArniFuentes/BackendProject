const mongoose = require("mongoose");

const userCollection = "user";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
  role: {
    type: String,
    enum: ["user", "admin", "premium"], // Roles
    default: "user", // Rol por defecto
  },
  githubId: Number,
});

const Users = mongoose.model(userCollection, userSchema);

module.exports = Users;
