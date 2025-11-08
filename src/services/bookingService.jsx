//src/services/bookingService.jsx

import { db } from "../firebaseConfig";
import { collection, addDoc, query, where, getDocs, Timestamp, } from "firebase/firestore";

const bookingsRef = collection(db, "bookings");

// Calcular precio según tipo
const getPrice = (tipo) => {
  return tipo === "dia" ? 100 : 50;
};

// Verificar si es fin de semana
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 6 || day === 0; // 6 = sábado, 0 = domingo
};

// Obtener reservas del usuario
export const getUserBookings = async (uid) => {
  const q = query(bookingsRef, where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

// Crear reserva
export const createBooking = async (uid, fecha, tipo) => {
  const date = new Date(fecha);

  // Validar límite de fines de semana
  if (isWeekend(date)) {
    const q = query(
      bookingsRef,
      where("uid", "==", uid),
      where("isWeekend", "==", true)
    );
    const snapshot = await getDocs(q);
    if (snapshot.size >= 5) {
      throw new Error("Has alcanzado el límite de 5 reservas en fin de semana.");
    }
  }

  const newBooking = {
    uid,
    fecha: Timestamp.fromDate(date),
    tipo, // 'mañana', 'tarde' o 'dia'
    precio: getPrice(tipo),
    isWeekend: isWeekend(date),
    createdAt: Timestamp.now(),
  };

  await addDoc(bookingsRef, newBooking);
  return newBooking;
};











