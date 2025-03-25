import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyACYfRiAHKSvspuluSX99wBjkrTvTjU5nQ",
    authDomain: "smart-healthcare-iot.firebaseapp.com",
    projectId: "smart-healthcare-iot",
    storageBucket: "smart-healthcare-iot.appspot.com", // ✅ Corrected
    messagingSenderId: "210475541904",
    appId: "1:210475541904:web:c56755e8fceaa2bfc77f15"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
