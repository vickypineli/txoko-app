// src/services/bookingService.js

import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where, Timestamp, orderBy } from "firebase/firestore";

//Crear una reserva validando que la fecha no hay sido reservada. 
// y que el usuario no tenga mas de 5 fines de semana.
export const createBooking = async (bookingData) => {
  const { date, type, userId } = bookingData;

  try {
    // Validar reservas existentes del mismo día
    const duplicateCheck = query(
      collection(db, "bookings"),
      where("date", "==", date)
    );
    const snap = await getDocs(duplicateCheck);

    let conflict = false;
    snap.forEach((doc) => {
      const b = doc.data();

      // 🔴 Si ya existe una reserva de día completo, conflicto
      if (b.type === "full") conflict = true;

      // 🔴 Si intentas reservar día completo y hay alguna reserva, conflicto
      if (type === "full" && b.type !== "") conflict = true;

      // 🔴 Si ambos son el mismo turno, conflicto
      if (b.type === type) conflict = true;
    });

    if (conflict) {
      throw new Error("⚠️ Ya existe una reserva para ese día o turno. Elige otra fecha.");
    }

    // Validar que el usuario no tenga más de 5 fines de semana reservados
    const userSnap = await getDocs(
      query(collection(db, "bookings"), where("userId", "==", userId))
    );

    let weekendCount = 0;
    userSnap.forEach((doc) => {
      const b = doc.data();
      const d = new Date(b.date);
      const day = d.getDay(); // 0=domingo, 6=sábado
      if (day === 0 || day === 6) weekendCount++;
    });

    const newDate = new Date(date);
    const isWeekend = [0, 6].includes(newDate.getDay());
    if (isWeekend && weekendCount >= 5) {
      throw new Error("⚠️ No puedes reservar más de 5 fines de semana al año.");
    }

    // Si pasa las validaciones, guardamos la reserva
    await addDoc(collection(db, "bookings"), {
      ...bookingData,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error al crear reserva:", error);
    throw error;
  }
};

//  Obtener todas las reservas
export const getAllBookings = async () => {
  try {
    const snap = await getDocs(collection(db, "bookings"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

// 🔹 Obtener reservas de un usuario
export const getUserBookings = async (uid) => {
  try {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error(err);
    return [];
  }
};









