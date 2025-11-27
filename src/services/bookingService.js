// src/services/bookingService.js
import {
  collection,
  addDoc,
  getDocs,
  //getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const BOOKINGS = "bookings";

// Normaliza siempre el objeto
const normalizeBooking = (docSnap) => ({
  id: docSnap.id,
  ...docSnap.data(),
});

//Crear reserva
export const createBooking = async (booking) => {
  if (!booking.userId || !booking.userName) {
    throw new Error("Faltan datos obligatorios: userId o userName.");
  }

  return await addDoc(collection(db, BOOKINGS), booking);
};

//Obtener reservas de un usuario
export const getUserBookings = async (uid) => {
  const q = query(collection(db, BOOKINGS), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map(normalizeBooking);
};

 /**
 * Obtener todas las reservas (admin, home, etc.)
 */

export const getAllBookings = async () => {
  try{
    const q = query(collection(db, BOOKINGS), orderBy("date", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map(normalizeBooking);
  } catch (err) {
    console.error("❌ Error al obtener todas las reservas:", err);
    return [];    
  }
};

//Editar reserva
export const updateBooking = async (id, bookingData) => {
  await updateDoc(doc(db, BOOKINGS, id), bookingData);
};

//Eliminar reserva
export const deleteBooking = async (id) => {
  await deleteDoc(doc(db, BOOKINGS, id));
};








