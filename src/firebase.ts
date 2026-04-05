import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
// 1. Import Firestore
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyD_qz-rzZq-_c_JTYHw494AeAxE-1vPBmA",
  authDomain: "unify-3.firebaseapp.com",
  projectId: "unify-3",
  storageBucket: "unify-3.firebasestorage.app",
  messagingSenderId: "34667720065",
  appId: "1:34667720065:web:fb37a2709ece6503130c80",
  measurementId: "G-NP7FM48CJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. Export the services you need
export const auth = getAuth(app);
export const db = getFirestore(app); // This fixes the 'db' export error