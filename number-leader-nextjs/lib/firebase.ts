// Import the functions you need from the SDKs
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIF79Q_YzZZZ6moLLX2nZqpEWAh2R-ZOA",
  authDomain: "numberleader-9210c.firebaseapp.com",
  projectId: "numberleader-9210c",
  storageBucket: "numberleader-9210c.firebasestorage.app",
  messagingSenderId: "876974295363",
  appId: "1:876974295363:web:9cce71ede23d19b68647f6",
  measurementId: "G-X07KVYRLB4"
};

// Initialize Firebase
let firebaseApp;
let analytics;
let db: Firestore;

// Check if we're in the browser and if Firebase hasn't been initialized yet
if (typeof window !== 'undefined' && !getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  // Only initialize analytics in the browser
  analytics = getAnalytics(firebaseApp);
  db = getFirestore(firebaseApp);
} else {
  // For SSR, initialize without analytics
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
  }
}

// Export Firestore for use in the app
export { db }; 