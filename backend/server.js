require('dotenv').config(); // Load environment variables
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;
const db = require("./firebaseConfig"); // Import Firebase Firestore

app.use(express.json()); // ✅ Fix: Middleware to parse JSON body

// Test Firebase Connection
db.collection("test")
    .get()
    .then(() => console.log("✅ Firebase Firestore Connected"))
    .catch((err) => console.log("❌ Firebase Firestore Error:", err));

app.use("/api/auth", authRoutes);

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes"); // ✅ Ensure it's imported

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); // ✅ Ensure it's registered


// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
