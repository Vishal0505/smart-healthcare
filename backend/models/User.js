// backend/models/User.js - User Model

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["doctor", "patient", "admin"],
      default: "patient",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
