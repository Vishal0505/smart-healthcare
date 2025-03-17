// backend/routes/doctorRoutes.js - Doctor Dashboard Routes

const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getDoctorDashboard } = require('../controllers/doctorController');

const router = express.Router();

// Get doctor dashboard data (Only accessible by doctors)
router.get('/dashboard', protect, authorize('doctor'), getDoctorDashboard);

module.exports = router;
