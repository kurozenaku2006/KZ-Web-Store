import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { auth, db } from "../config/firebase.js";

async function recordLogin(user){

  const ua=navigator.userAgent;

  await addDoc(

    collection(db,"loginHistory"),

    {

      uid:user.uid,

      email:user.email,

      browser:ua,

      device:navigator.platform,

      os:navigator.platform,

      ip:"",

      loginAt:new Date().toISOString()

    }

  );

}

export async function registerUser(name, email, password) {

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    role: "customer",
    active: true,
    rewardPoints: 0,
    createdAt: serverTimestamp()
  });

  return user;
}

export async function loginUser(email, password) {

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  await recordLogin(userCredential.user);

return userCredential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function getUserData(uid) {

  const snapshot =
    await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}

export function authListener(callback) {
  onAuthStateChanged(auth, callback);
}