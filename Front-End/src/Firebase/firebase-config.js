// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore' 
import {getStorage} from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAg4RtD-Zr5oa8-2G20ETZd9QBp6n0QKnk",
  authDomain: "ocr-46b8b.firebaseapp.com",
  projectId: "ocr-46b8b",
  storageBucket: "ocr-46b8b.appspot.com",
  messagingSenderId: "985822214767",
  appId: "1:985822214767:web:7cb99573d5b64f56e2eb9a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage =  getStorage(app);