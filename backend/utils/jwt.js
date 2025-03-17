// backend/utils/jwt.js - JWT Token Generation

const jwt = require("jsonwebtoken");

// Function to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Token valid for 7 days
  );
};

module.exports = generateToken;
