// Import the Firebase modules that you need in your app
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3Ntzi0dJzHJeCor-IYor0JluxCl3pfAY",
  authDomain: "shipping-11.firebaseapp.com",
  projectId: "shipping-11",
  storageBucket: "shipping-11.firebasestorage.app",
  messagingSenderId: "655813238785",
  appId: "1:655813238785:web:e12ffc55c022d73a88a000",
  measurementId: "G-KN318J06ZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);