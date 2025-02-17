// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDw_D6cV4g9tsZ7aVWl6nZB4-BbhZ28veY",
    authDomain: "todolistreactjs-fd775.firebaseapp.com",
    projectId: "todolistreactjs-fd775",
    storageBucket: "todolistreactjs-fd775.firebasestorage.app",
    messagingSenderId: "790735951890",
    appId: "1:790735951890:web:2f17597b7cab2943c4a0cb",
    measurementId: "G-P8Z5FJ99NT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }