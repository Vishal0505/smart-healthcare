import admin from "../config/firebaseAdmin.js";
import db from "../config/firestore.js";

// Middleware to authenticate user using Firebase ID Token
export const authenticateUser = async (req, res, next) => {
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
export const authorizeRole = (allowedRoles) => async (req, res, next) => {
    try {
        const roleDoc = await db.collection("roles").doc(req.user.uid).get();
        if (!roleDoc.exists || !allowedRoles.includes(roleDoc.data().role)) {
            return res.status(403).json({ error: "Access denied. Insufficient permissions." });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: "Error checking role" });
    }
};
