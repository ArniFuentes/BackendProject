const jwt = require("jsonwebtoken");
const { secret } = require("../configs/config");

const generateToken = (user) => {
    return jwt.sign(user, secret);
};

// const authenticateMddlaware = (req, res, next) => {
//     const authHeaders = req.headers.authorization;
//     const authHeadersList = authHeaders.split(" ");
//     const token = authHeadersList[1];
//     jwt.verify(token, secret, (error, credencials))
    
// };

module.exports = {
    generateToken,
    // authenticateMddlaware,
};
