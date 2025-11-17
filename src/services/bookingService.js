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

// export const getAllBookings = async () => {
//   const snap = await getDocs(collection(db, BOOKINGS));
//   return snap.docs.map(normalizeBooking);
// };

// export const getAllBookings = async () => {
//   try {
//     const q = query(collection(db, "bookings"), orderBy("date", "asc"));
//     const snap = await getDocs(q);
//     return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//   } catch (err) {
//     console.error("❌ Error al obtener todas las reservas:", err);
//     return [];
//   }
// };

//Editar reserva
export const updateBooking = async (id, bookingData) => {
  await updateDoc(doc(db, BOOKINGS, id), bookingData);
};

//Eliminar reserva
export const deleteBooking = async (id) => {
  await deleteDoc(doc(db, BOOKINGS, id));
};

// /**
//  * 🟢 Crear una reserva validando:
//  * - Que la fecha/turno no esté ya ocupada.
//  * - Que el usuario no supere 5 fines de semana reservados al año.
//  */
// export const createBooking = async (bookingData) => {
//   const { date, type, userId } = bookingData;

//   try {
//     // 1️⃣ Verificar conflicto en la misma fecha
//     const duplicateCheck = query(collection(db, "bookings"), where("date", "==", date));
//     const snap = await getDocs(duplicateCheck);

//     let conflict = false;
//     snap.forEach((doc) => {
//       const b = doc.data();

//       if (b.type === "full") conflict = true;
//       if (type === "full" && b.type !== "") conflict = true;
//       if (b.type === type) conflict = true;
//     });

//     if (conflict) {
//       throw new Error("⚠️ Ya existe una reserva para ese día o turno. Elige otra fecha.");
//     }

//     // 2️⃣ Verificar límite de 5 fines de semana por usuario
//     const userSnap = await getDocs(
//       query(collection(db, "bookings"), where("userId", "==", userId))
//     );

//     let weekendCount = 0;
//     userSnap.forEach((doc) => {
//       const b = doc.data();
//       const d = new Date(b.date);
//       const day = d.getDay(); // 0 = domingo, 6 = sábado
//       if (day === 0 || day === 6) weekendCount++;
//     });

//     const newDate = new Date(date);
//     const isWeekend = [0, 6].includes(newDate.getDay());
//     if (isWeekend && weekendCount >= 5) {
//       throw new Error("⚠️ No puedes reservar más de 5 fines de semana al año.");
//     }

//     // 3️⃣ Crear la reserva
//     await addDoc(collection(db, "bookings"), {
//       ...bookingData,
//       createdAt: Timestamp.now(),
//     });

//     console.log("✅ Reserva creada correctamente");
//   } catch (error) {
//     console.error("❌ Error al crear reserva:", error);
//     throw error;
//   }
// };



// /**
//  * Obtener reservas de un usuario específico
//  * Filtra solo las del año actual y las ordena por fecha descendente.
//  */
// export const getUserBookings = async (uid) => {
//   try {
//     const q = query(collection(db, "bookings"), where("userId", "==", uid));
//     const snapshot = await getDocs(q);
//     const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // ✅ Filtrar solo reservas del año actual
//     const currentYear = new Date().getFullYear();
//     const filtered = data.filter(
//       (b) => new Date(b.date).getFullYear() === currentYear
//     );

//       // ✅ Ordenar de más reciente a más antigua
//     filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
//     return filtered;
//   } catch (error) {
//     console.error("❌ Error al obtener reservas del usuario:", error);
//     return [];
//   }
// };

// /**
//  * 🗑️ Eliminar una reserva
//  */
// export const deleteBooking = async (bookingId) => {
//   try {
//     await deleteDoc(doc(db, "bookings", bookingId));
//     console.log("🗑️ Reserva eliminada correctamente");
//   } catch (error) {
//     console.error("❌ Error al eliminar reserva:", error);
//     throw error;
//   }
// };

// /**
//  * 🔍 Obtener reservas filtradas por fecha
//  */
// export const getBookingsByDate = async (date) => {
//   try {
//     const q = query(collection(db, "bookings"), where("date", "==", date));
//     const snap = await getDocs(q);
//     return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//   } catch (err) {
//     console.error("❌ Error al obtener reservas por fecha:", err);
//     return [];
//   }
// };

// /**
//  *Obtener TODAS las reservas(para el panel de admin)
//  */

// export const getAllBookingsAdmin = async () => {
//   const querySnapshot = await getDocs(collection(db, "bookings"));
//   return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// // Actualizar reserva
// export const updateBooking = async (id, updatedData) => {
//   const bookingRef = doc(db, "bookings", id);
//   await updateDoc(bookingRef, updatedData);
// };







