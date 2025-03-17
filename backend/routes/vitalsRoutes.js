// backend/routes/vitalsRoutes.js - Vitals API Routes

const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { getVitals, addVitals } = require("../controllers/vitalsController");

const router = express.Router();

// Get vitals for a specific patient (Accessible by doctor & patient)
router.get("/:patientId", protect, authorize("doctor", "patient"), getVitals);

// Add new vitals entry (Only doctors can add)
router.post("/:patientId", protect, authorize("doctor"), addVitals);

module.exports = router;
