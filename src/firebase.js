// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics'; // Temporarily disabled

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Replace these placeholder values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyA-9knkYwOfGjjZhJZV5NCvN5eafBf9_Wo",
  authDomain: "garmin-friends.firebaseapp.com",
  projectId: "garmin-friends",
  storageBucket: "garmin-friends.firebasestorage.app",
  messagingSenderId: "379717147009",
  appId: "1:379717147009:web:090359a228ca41f7d67080"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics and get a reference to the service (disabled until proper config)
// export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const analytics = null; // Temporarily disabled

export default app;