const { admin, db } = require("../config/firebaseConfig");

// Middleware to authenticate user using Firebase ID Token
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized, token missing" });

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

// Middleware to authorize user based on Firestore roles
const authorizeRole = (allowedRoles) => async (req, res, next) => {
    try {
        const userDoc = await db.collection("users").doc(req.user.uid).get();
        if (!userDoc.exists || !allowedRoles.includes(userDoc.data().role)) {
            return res.status(403).json({ error: "Access denied. Insufficient permissions." });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: "Error checking role" });
    }
};

module.exports = { authenticateUser, authorizeRole };
