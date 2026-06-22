// Firebase Core
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

// Firebase Auth
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firestore
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDrL_56TEZnvKLsNqlfOnJ_HtZ9kNRSk9Y",
  authDomain: "kz-gundam-store-ce087.firebaseapp.com",
  projectId: "kz-gundam-store-ce087",
  storageBucket: "kz-gundam-store-ce087.firebasestorage.app",
  messagingSenderId: "415665435472",
  appId: "1:415665435472:web:6c92329508215d4f4ef255",
  measurementId: "G-D16P6MY81D"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };