const express = require("express");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/secure-data", authenticateUser, authorizeRole(["doctor", "admin"]), (req, res) => {
    res.json({ message: "Secure data accessed", user: req.user });
});

module.exports = router;
