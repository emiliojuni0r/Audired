// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzuuTOiiNq9HHJ9sGRsCpMHsIB_drWrUM",
  authDomain: "audired-820e0.firebaseapp.com",
  projectId: "audired-820e0",
  storageBucket: "audired-820e0.firebasestorage.app",
  messagingSenderId: "401028140081",
  appId: "1:401028140081:web:16b491c3051c82ae39d910",
  measurementId: "G-RBYM3C85BT"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistent storage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
