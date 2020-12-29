const jwt = require("jsonwebtoken");
const { JWT_AUTH } = require("../config");

const getUniqueUsername = (name) => {
  return name.split(" ")[0] + Math.floor(Math.random() * 10000000 + 1);
};

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_AUTH, {
    expiresIn: "1h",
  });
};

module.exports = {
  getUniqueUsername,
  generateToken,
};
