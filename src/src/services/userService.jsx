// src/services/userService.js
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Crear perfil de usuario al registrarse
export const createUserProfile = async (uid, userData) => {
  try {
    await setDoc(doc(db, "users", uid), userData);
  } catch (error) {
    console.error("Error al crear perfil de usuario:", error);
  }
};

// Obtener perfil del usuario
export const getUserProfile = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No se encontró el usuario");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener perfil:", error);
  }
};

// Actualizar perfil
export const updateUserProfile = async (uid, data) => {
  try {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, data);
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
  }
};
