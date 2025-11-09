//src/services/bookingService.jsx
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Escucha en tiempo real las reservas de un mes concreto
 * @param {number} year - año del calendario
 * @param {number} month - mes (0 = enero)
 * @param {function} callback - función que recibe las reservas
 */
export const listenBookingsByMonth = (year, month, callback) => {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-31`;

  const q = query(
    collection(db, "reservas"),
    where("date", ">=", startDate),
    where("date", "<=", endDate)
  );

  // Escucha cambios en tiempo real
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map((doc) => doc.data());
    callback(bookings);
  });

  return unsubscribe;
};











