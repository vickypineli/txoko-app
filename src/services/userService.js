
// src/services/userService.js
import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,serverTimestamp } from "firebase/firestore";

/**
 * Crear perfil de usuario al registrarse
 * Guarda los datos del usuario en la colección "users" con su UID como ID.
 */
export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("✅ Perfil de usuario creado correctamente");
  } catch (error) {
    console.error("❌ Error al crear perfil de usuario:", error);
    throw error;
  }
};
/**
 * Obtener todos los perfiles de usuario desde Firestore
 */
export const getAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return users;
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    throw error;
  }
}

/**
 * Obtener perfil de usuario desde Firestore
 */
export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn("⚠️ No se encontró el perfil del usuario:", uid);
      return null;
    }
  } catch (error) {
    console.error("❌ Error al obtener perfil:", error);
    throw error;
  }
};

/**
* obtiener usuario por id
*/
export const getUserById = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn("⚠️ No se encontró usuario con UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("❌ Error en getUserById:", error);
    throw error;
  }
};

/**
 * Actualizar perfil del usuario
 */
export const updateUserProfile = async (uid, data) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
    console.log("✅ Perfil actualizado correctamente");
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error);
    throw error;
  }
};

/** 
** Eliminar perfil de usuario
*/
export const deleteUserProfile = async (uid) => {
  try {
    await deleteDoc(doc(db, "users", uid));
    console.log("🗑 Perfil eliminado:", uid);
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    throw error;
  }
};


