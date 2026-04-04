import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDsEHo_K2W2zBz5L1yKrcNMI4CkJZyKIeY",
  authDomain: "mutho-sech.firebaseapp.com",
  projectId: "mutho-sech",
  storageBucket: "mutho-sech.firebasestorage.app",
  messagingSenderId: "1084227122128",
  appId: "1:1084227122128:web:a9a7cfdf3735f16531bfd5",
  measurementId: "G-RD36V8LNMB"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics runs client-side only
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
