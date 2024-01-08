// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAeTtU8ooix8I8yOTbbZw_BLNZNKSKmAVc",
    authDomain: "shopsync-7ef0b.firebaseapp.com",
    projectId: "shopsync-7ef0b",
    storageBucket: "shopsync-7ef0b.appspot.com",
    messagingSenderId: "819961324847",
    appId: "1:819961324847:web:ba9d8577c6d78a1f212dda",
    measurementId: "G-LHTSTS2CT2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Firestore instance
const firebaseAuth = getAuth(app);

// Firestore instance
const db = getFirestore(app);

// Instance of google provider object
const googleProvider = new GoogleAuthProvider();

// Firebase Storage Instance
// Initialize cloud storage and get a reference to the service
const storage = getStorage(app);

export { firebaseAuth, db, googleProvider, storage };
