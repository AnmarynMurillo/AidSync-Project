// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJ395j9EL5Nv81Q70Csc4zRKNp5e1Xrjo",
  authDomain: "expo-project-1040e.firebaseapp.com",
  projectId: "expo-project-1040e",
  storageBucket: "expo-project-1040e.firebasestorage.app",
  messagingSenderId: "813329495011",
  appId: "1:813329495011:web:931d42531c471fe3e2e6d6",
  measurementId: "G-QY0VQSB12F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);