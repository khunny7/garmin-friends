// Firebase configuration and initialization
// This file contains the Firebase setup for the Garmin Friends application

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-9knkYwOfGjjZhJZV5NCvN5eafBf9_Wo",
    authDomain: "garmin-friends.firebaseapp.com",
    projectId: "garmin-friends",
    storageBucket: "garmin-friends.firebasestorage.app",
    messagingSenderId: "379717147009",
    appId: "1:379717147009:web:090359a228ca41f7d67080"
};

// Export the configuration for use in other modules
export { firebaseConfig };

// Initialize Firebase when this module is imported
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export Firebase instances
export { app, db, auth, storage };

// Log successful initialization
console.log('Firebase services initialized:', {
    app: !!app,
    firestore: !!db,
    auth: !!auth,
    storage: !!storage
});