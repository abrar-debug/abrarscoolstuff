// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  storageBucket: "gs://aqeelah-website.firebasestorage.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 