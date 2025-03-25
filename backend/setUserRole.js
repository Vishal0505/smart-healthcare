import admin from "../config/firebaseAdmin.js"; // Firebase Admin SDK
import db from "../config/firestore.js"; // Firestore instance

const setUserRole = async (uid, role) => {
    try {
        // Store role in Firestore
        await db.collection("roles").doc(uid).set({ role });

        console.log(`Role '${role}' assigned to user ${uid}`);
        return { success: true, message: `Role '${role}' assigned to user` };
    } catch (error) {
        console.error("Error setting user role:", error);
        return { success: false, error: error.message };
    }
};

export default setUserRole;
