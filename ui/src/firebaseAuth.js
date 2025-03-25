import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken(); // Get ID Token

        console.log("User Logged In:", userCredential.user);
        console.log("Token:", token); // Send this token to the backend

        return token;
    } catch (error) {
        console.error("Login Error:", error.message);
        throw error;
    }
};
