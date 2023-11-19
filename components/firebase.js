import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBabYAJVs9DbBSbK5AE_Klh9PLjobUHt1U",
    authDomain: "gamezone-b4b27.firebaseapp.com",
    projectId: "gamezone-b4b27",
    storageBucket: "gamezone-b4b27.appspot.com",
    messagingSenderId: "588474553521",
    appId: "1:588474553521:web:e892a4a65c072a3c4bfe90",
    measurementId: "G-7GN475T8GQ",
    databaseURL:"https://gamezone-b4b27-default-rtdb.asia-southeast1.firebasedatabase.app"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const firestore = getFirestore(app);




export { auth, firestore, db };

