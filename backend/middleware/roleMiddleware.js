const { db } = require("../config/firebaseConfig");

const checkRole = (allowedRoles) => async (req, res, next) => {
    try {
        const userRef = db.collection("users").doc(req.user.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }

        const userRole = userDoc.data().role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: "Forbidden: Access denied" });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: "Error checking role", details: error.message });
    }
};

module.exports = { checkRole };
