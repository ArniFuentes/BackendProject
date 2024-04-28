import jwt from "jsonwebtoken";
import config from "../configs/config.js";

const generateToken = (user) => {
  return jwt.sign(user, config.secret);
};

export default generateToken;
