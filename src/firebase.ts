import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Added this
import { getFirestore } from "firebase/firestore"; // Added this
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB2ozwEYKEXO8o4RrZLB187rJ1PQjO9OTc",
  authDomain: "unify2-2c34f.firebaseapp.com",
  databaseURL: "https://unify2-2c34f-default-rtdb.firebaseio.com",
  projectId: "unify2-2c34f",
  storageBucket: "unify2-2c34f.firebasestorage.app",
  messagingSenderId: "883586717972",
  appId: "1:883586717972:web:ce44e368a91b315dfdca01",
  measurementId: "G-J35JN3V7X3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export services
export const auth = getAuth(app);      // This fixes the "auth" export error
export const db = getFirestore(app);   // This fixes the "db" export error
export const analytics = getAnalytics(app);

export default app;
