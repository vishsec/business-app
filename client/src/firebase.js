// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "business-app-57cc3.firebaseapp.com",
  projectId: "business-app-57cc3",
  storageBucket: "business-app-57cc3.appspot.com",
  messagingSenderId: "246583159343",
  appId: "1:246583159343:web:7facdf2dd4a01be5d734da"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);