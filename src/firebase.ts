// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
