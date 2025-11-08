// src/components/BookingForm.jsx
import { useState } from "react";
import { auth } from "../firebaseConfig";
import { createBooking } from "../services/bookingService";
import "../styles/pages/BookingForm.scss";

function BookingForm() {
  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState("mañana");
  const [mensaje, setMensaje] = useState("");

  const handleReserva = async () => {
    setMensaje("");
    const user = auth.currentUser;
    if (!user) return setMensaje("Debes iniciar sesión primero.");

    try {
      const booking = await createBooking(user.uid, fecha, tipo);
      setMensaje(`✅ Reserva creada correctamente. Precio: ${booking.precio}€`);
    } catch (error) {
      setMensaje(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Reserva del Txoko</h2>

      <label>Fecha:</label><br />
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      /><br /><br />

      <label>Tipo de reserva:</label><br />
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="mañana">Mañana (12:00 - 17:00) — 50€</option>
        <option value="tarde">Tarde (18:00 - 00:00) — 50€</option>
        <option value="dia">Todo el día — 100€</option>
      </select><br /><br />

      <button onClick={handleReserva}>Reservar</button>
      <p>{mensaje}</p>
    </div>
  );
}

export default BookingForm;