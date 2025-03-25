const express = require("express");
const admin = require("../firebaseAdmin.js"); // ✅ Correct import path
const { authorizeRole, authenticateUser } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Assign a role (Only Admins can do this)
router.post("/assign-role", authenticateUser, authorizeRole(["admin"]), async (req, res) => {
    try {
        const { uid, role } = req.body;

        if (!uid || !role) {
            return res.status(400).json({ error: "User ID and role are required" });
        }

        await admin.auth().setCustomUserClaims(uid, { role });

        res.json({ message: `Role '${role}' assigned to user ${uid}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
