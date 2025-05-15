// Import the functions you need from the SDKs
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let firebaseApp;
let analytics;
let db: Firestore;
let storage: FirebaseStorage;
let auth: Auth;

// Check if we're in the browser and if Firebase hasn't been initialized yet
if (typeof window !== 'undefined' && !getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  // Only initialize analytics in the browser
  analytics = getAnalytics(firebaseApp);
  db = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);
  auth = getAuth(firebaseApp);
} else {
  // For SSR, initialize without analytics
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);
    auth = getAuth(firebaseApp);
  }
}

// Export Firestore and Storage for use in the app
export { db, storage, auth }; 