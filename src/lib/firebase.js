import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDv1vlh36EFDmJkNM6f4m5aYe0MDhZqmJI",
  authDomain: "crochet-with-dilru.firebaseapp.com",
  projectId: "crochet-with-dilru",
  storageBucket: "crochet-with-dilru.firebasestorage.app",
  messagingSenderId: "476259179326",
  appId: "1:476259179326:web:8dc8994f6ea0aff5706a6f",
};


// Prevent duplicate initialization during hot reloads
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
