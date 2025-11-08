// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-hEiR8FeKg3_yshKEEwwpxlFs9Th7Cf0",
  authDomain: "txoko-app.firebaseapp.com",
  projectId: "txoko-app",
  storageBucket: "txoko-app.firebasestorage.app",
  messagingSenderId: "1049674512161",
  appId: "1:1049674512161:web:861d3ad4caf2bcc892f060"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la autenticación y el proveedor de Google
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Inicia la base de datos
export const db = getFirestore(app);
