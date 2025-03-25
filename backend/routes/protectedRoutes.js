import express from "express";
import { authenticateUser, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 Protected route for all authenticated users
router.get("/profile", authenticateUser, (req, res) => {
    res.json({ message: "Access granted", user: req.user });
});

// 🔒 Admin-only route
router.get("/admin-dashboard", authenticateUser, authorizeRole(["admin"]), (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard" });
});

// 🔒 Doctor-only route
router.get("/doctor-dashboard", authenticateUser, authorizeRole(["doctor"]), (req, res) => {
    res.json({ message: "Welcome to Doctor Dashboard" });
});

export default router;
