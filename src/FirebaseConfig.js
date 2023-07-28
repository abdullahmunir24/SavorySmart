import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANhnk7Zsm2DeyRaFxQRTQfas31gmhTEXA",
  authDomain: "recipe-85d06.firebaseapp.com",
  projectId: "recipe-85d06",
  storageBucket: "recipe-85d06.appspot.com",
  messagingSenderId: "1040941005405",
  appId: "1:1040941005405:web:407cd3b2b9d5d362712bb4",
  measurementId: "G-PNFENKYDZW",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
