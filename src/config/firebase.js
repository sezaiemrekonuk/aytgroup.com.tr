/**
 * Firebase Configuration
 *
 * All values are loaded from environment variables.
 * Copy .env.example → .env.local and fill in your Firebase project values.
 * Never commit the actual .env file.
 *
 * To get these values:
 *   1. Go to Firebase Console → Your Project → Project Settings → General
 *   2. Scroll to "Your apps" → Web app → SDK setup and configuration
 *   3. Copy the firebaseConfig object values here.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// ─── Firebase Config Object ────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId:     process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// ─── Singleton Initialization ─────────────────────────────────────────────────
// Prevent re-initialization during hot-reload in development
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ─── Services ─────────────────────────────────────────────────────────────────
export const db      = getFirestore(app);
export const storage = getStorage(app);
export const auth    = getAuth(app);

// Analytics is browser-only and not available in SSR/test environments
export const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

// ─── Emulator Support (development only) ─────────────────────────────────────
if (process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.info('[Firebase] 🔧 Using local emulators (Firestore :8080, Storage :9199, Auth :9099)');
  } catch {
    // Emulators already connected — safe to ignore in hot-reload
  }
}

export default app;
