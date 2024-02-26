const jwt = require("jsonwebtoken");
const { secret } = require("../configs/config");

const generateToken = (user) => {
  return jwt.sign(user, secret);
};

module.exports = generateToken;
