const express = require("express");
const { admin } = require("../config/firebaseConfig")

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { email, password, displayName, role = "patient" } = req.body;

        if (!email || !password || !displayName) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Create user in Firebase Auth
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName,
        });

        // Assign role using custom claims
        await admin.auth().setCustomUserClaims(userRecord.uid, { role });

        res.status(201).json({
            message: "User created successfully",
            user: { uid: userRecord.uid, email: userRecord.email, role },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Login Route
router.post("/login", async (req, res) => {
    return res.status(400).json({ error: "Use Firebase SDK on the frontend for login." });
});

// Token Verification Route
router.post("/me", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized, token missing" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        return res.json({ message: "Token Verified", user: decodedToken });

    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
});


router.get("/secure-data", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized, token missing" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        return res.json({ message: "Token Verified", user: decodedToken });

    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token", details: error.message });
    }
});


module.exports = router;
