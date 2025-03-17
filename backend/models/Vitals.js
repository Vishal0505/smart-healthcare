// backend/models/Vitals.js - Vitals Schema

const mongoose = require("mongoose");

const VitalsSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  heartRate: Number,
  bloodPressure: String,
  temperature: Number,
  oxygenSaturation: Number,
  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Vitals", VitalsSchema);
