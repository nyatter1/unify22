import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyD_qz-rzZq-_c_JTYHw494AeAxE-1vPBmA",
authDomain: "unify-3.firebaseapp.com",
databaseURL: "https://unify2-2c34f-default-rtdb.firebaseio.com",
projectId: "unify-3",
storageBucket: "unify-3.firebasestorage.app",
messagingSenderId: "34667720065",
appId: "1:34667720065:web:fb37a2709ece6503130c80",
measurementId: "G-NP7FM48CJ9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


