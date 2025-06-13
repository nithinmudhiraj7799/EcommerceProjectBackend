const jwt = require("jsonwebtoken");

const generateToken = (userId,email) => {
  return jwt.sign({ id: userId ,email}, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
