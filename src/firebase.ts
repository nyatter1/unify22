import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
