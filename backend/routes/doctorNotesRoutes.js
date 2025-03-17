// backend/routes/doctorNotesRoutes.js - Doctor's Notes API Routes

const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getDoctorNotes,
  addDoctorNote,
} = require("../controllers/doctorNotesController");

const router = express.Router();

// Get doctor's notes for a specific patient (Accessible by doctor & patient)
router.get(
  "/:patientId",
  protect,
  authorize("doctor", "patient"),
  getDoctorNotes
);

// Add a new doctor's note (Only doctors can add)
router.post("/:patientId", protect, authorize("doctor"), addDoctorNote);

module.exports = router;
