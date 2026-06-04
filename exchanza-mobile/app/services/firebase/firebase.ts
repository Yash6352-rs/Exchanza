import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsWWkNPowUPkqtIWbbYG0nVI1Q89dClQY",
  authDomain: "exchanza-1420.firebaseapp.com",
  projectId: "exchanza-1420",
  storageBucket: "exchanza-1420.firebasestorage.app",
  messagingSenderId: "949037840576",
  appId: "1:949037840576:web:1011d2c7a8725b935e9525",

  databaseURL: "https://exchanza-1420-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

