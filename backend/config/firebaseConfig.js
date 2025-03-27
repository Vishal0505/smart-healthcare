const admin = require("firebase-admin");

// Agar pehle se initialize nahi hai toh initialize karo
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(require("./serviceAccountKey.json")),
    });
}

const db = admin.firestore();

module.exports = { admin, db };
