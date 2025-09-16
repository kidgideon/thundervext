// firebase.js
import { initializeApp } from "firebase/app";

// Optional: import only what you need
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyACBVPgwSA553_UYYkqUpRzHXXniMLa6lk",
  authDomain: "stock-81ae1.firebaseapp.com",
  projectId: "stock-81ae1",
  storageBucket: "stock-81ae1.firebasestorage.app",
  messagingSenderId: "1090261806669",
  appId: "1:1090261806669:web:8e0e5f05612977c84ab604",
  measurementId: "G-8B2FYJG2JG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

// qbtrades
// const firebaseConfig = {
//   apiKey: "AIzaSyCNAo1ui6AKIId8mhfGVBUnECoiGgirF4Q",
//   authDomain: "qbtrades-official.firebaseapp.com",
//   projectId: "qbtrades-official",
//   storageBucket: "qbtrades-official.firebasestorage.app",
//   messagingSenderId: "513051608262",
//   appId: "1:513051608262:web:3f75119de2fdf89ea5c3c7",
//   measurementId: "G-T5ZQZ942M6"
// };