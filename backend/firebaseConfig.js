const admin = require("firebase-admin");

const serviceAccount = require("./smart-healthcare-iot-firebase-adminsdk-fbsvc-8da9180f70.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smart-healthcare-iot.firebaseio.com"
});

const db = admin.firestore();

module.exports = db;
