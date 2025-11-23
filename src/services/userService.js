// src/services/userService.js
import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const userRef = (uid) => doc(db, "users", uid);
const usersCollection = collection(db, "users");

export const createUser = async (uid, data) => {
  try {
    await setDoc(userRef(uid), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error creando usuario:", err);
    throw err;
  }
};

export const getAllUsers = async () => {
  try {
    const snap = await getDocs(usersCollection);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Error obteniendo usuarios:", err);
    throw err;
  }
};

export const getUser = async (uid) => {
  try {
    const snap = await getDoc(userRef(uid));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (err) {
    console.error("Error obteniendo usuario:", err);
    throw err;
  }
};

export const updateUser = async (uid, data) => {
  try {
    await updateDoc(userRef(uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Error actualizando usuario:", err);
    throw err;
  }
};

export const deleteUser = async (uid) => {
  try {
    await deleteDoc(userRef(uid));
  } catch (err) {
    console.error("Error eliminando usuario:", err);
    throw err;
  }
};


// src/services/userService.js
// import { db } from "../firebaseConfig";
// import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,serverTimestamp } from "firebase/firestore";

// const userRef = (uid) => doc(db, "users", uid);
// const usersCollection = collection(db, "users");

// /**
//  * Crear perfil de usuario al registrarse
//  * Guarda los datos del usuario en la colección "users" con su UID como ID.
//  */
// export const createUserProfile = async (uid, userData) => {
//   try {
//     const userRef = doc(db, "users", uid);
//     await setDoc(userRef, {
//       ...userData,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
//     console.log("✅ Perfil de usuario creado correctamente");
//   } catch (error) {
//     console.error("❌ Error al crear perfil de usuario:", error);
//     throw error;
//   }
// };

// /**
//  * Obtener todos los perfiles de usuario desde Firestore
//  */
// export const getAllUsers = async () => {
//   try {
//     const snapshot = await getDocs(collection(db, "users"));
//     const users = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));
//     return users;
//   } catch (error) {
//     console.error("❌ Error al obtener usuarios:", error);
//     throw error;
//   }
// }
// /**
//  * Obtener perfil de usuario desde Firestore
//  */
// export const getUser = async (uid) => {
//   const userRef = doc(db, "users", uid);
//   try {
//     const snap = await getDoc(userRef(uid));
//     if (!snap.exists()) return null;
//     return { id: snap.id, ...snap.data() };
//   } catch (err) {
//     console.error("Error obteniendo usuario:", err);
//     throw err;
//   }
// };

// /**
//  * Obtener perfil de usuario desde Firestore
//  */
// export const getUserProfile = async (uid) => {
//   try {
//     const userRef = doc(db, "users", uid);
//     const docSnap = await getDoc(userRef);

//     if (docSnap.exists()) {
//       return docSnap.data();
//     } else {
//       console.warn("⚠️ No se encontró el perfil del usuario:", uid);
//       return null;
//     }
//   } catch (error) {
//     console.error("❌ Error al obtener perfil:", error);
//     throw error;
//   }
// };

// /**
// * obtiener usuario por id
// */
// export const getUserById = async (uid) => {
//   try {
//     const userRef = doc(db, "users", uid);
//     const docSnap = await getDoc(userRef);

//     if (docSnap.exists()) {
//       return { id: docSnap.id, ...docSnap.data() };
//     } else {
//       console.warn("⚠️ No se encontró usuario con UID:", uid);
//       return null;
//     }
//   } catch (error) {
//     console.error("❌ Error en getUserById:", error);
//     throw error;
//   }
// };

// /**
//  * Actualizar perfil del usuario
//  */
// export const updateUserProfile = async (uid, data) => {
//   try {
//     const userRef = doc(db, "users", uid);
//     await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
//     console.log("✅ Perfil actualizado correctamente");
//   } catch (error) {
//     console.error("❌ Error al actualizar perfil:", error);
//     throw error;
//   }
// };

// /** 
// ** Eliminar perfil de usuario
// */
// export const deleteUserProfile = async (uid) => {
//   try {
//     await deleteDoc(doc(db, "users", uid));
//     console.log("🗑 Perfil eliminado:", uid);
//   } catch (error) {
//     console.error("❌ Error al eliminar usuario:", error);
//     throw error;
//   }
// };


