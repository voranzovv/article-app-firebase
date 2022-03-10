import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCO_IJcFMe_2lSYbj86bgHMM2hkykBXK6o",
  authDomain: "fir-app-68eac.firebaseapp.com",
  projectId: "fir-app-68eac",
  storageBucket: "fir-app-68eac.appspot.com",
  messagingSenderId: "162220159541",
  appId: "1:162220159541:web:ac5f451643008e9376377c",
  measurementId: "G-VG7PB8LMZ2",
};

const app = initializeApp(firebaseConfig);

// Create a storage reference
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
