// backend/routes/patientRoutes.js - Patient Data Routes

const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { getPatientProfile } = require("../controllers/patientController");

const router = express.Router();

// Get patient profile (Only accessible by doctors & the patient themselves)
router.get("/:id", protect, authorize("doctor", "patient"), getPatientProfile);

module.exports = router;
