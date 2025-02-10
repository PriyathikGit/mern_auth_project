// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-auth-d0904.firebaseapp.com',
  projectId: 'mern-auth-d0904',
  storageBucket: 'mern-auth-d0904.firebasestorage.app',
  messagingSenderId: '338659437476',
  appId: '1:338659437476:web:a6b9f7f96087f17c082f31',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
