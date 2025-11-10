// src/components/ReservationModal.jsx
import { useState, useEffect } from "react";
import { createBooking } from "../services/bookingService";
import { auth } from "../firebaseConfig";
import "../styles/components/ReservationModal.scss";

function ReservationModal({ date, existingBookings = [], onClose, onSaved }) {
  const [formData, setFormData] = useState({
    date: date || "",
    type: "morning",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState({
    morning: true,
    afternoon: true,
    full: true,
  });

  const user = auth.currentUser;

  // Sincronizar la fecha entrante
  useEffect(() => {
    if (date) setFormData((prev) => ({ ...prev, date }));
  }, [date]);

  // Calcular disponibilidad cuando cambie la fecha o las reservas existentes
  useEffect(() => {
    const reservedTypes = existingBookings.map((b) => b.type);

    // Regla:
    // - Si hay "full" -> todo ocupado
    // - Si hay "morning" -> morning y full NO disponibles, afternoon disponible
    // - Si hay "afternoon" -> afternoon y full NO disponibles, morning disponible
    // - Si no hay reservas -> todo disponible
    const hasFull = reservedTypes.includes("full");
    const hasMorning = reservedTypes.includes("morning");
    const hasAfternoon = reservedTypes.includes("afternoon");

    let morningAvailable = true;
    let afternoonAvailable = true;
    let fullAvailable = true;

    if (hasFull || (hasMorning && hasAfternoon)) {
      morningAvailable = false;
      afternoonAvailable = false;
      fullAvailable = false;
    } else if (hasMorning) {
      morningAvailable = false;
      afternoonAvailable = true;
      fullAvailable = false; // no se puede reservar full si una franja ya está ocupada
    } else if (hasAfternoon) {
      morningAvailable = true;
      afternoonAvailable = false;
      fullAvailable = false;
    } else {
      morningAvailable = true;
      afternoonAvailable = true;
      fullAvailable = true;
    }

    setAvailability({
      morning: morningAvailable,
      afternoon: afternoonAvailable,
      full: fullAvailable,
    });

    // Si el tipo actualmente seleccionado no está disponible, ajustar al primero disponible
    const currentlySelected = formData.type;
    const firstAvailable = morningAvailable
      ? "morning"
      : afternoonAvailable
      ? "afternoon"
      : fullAvailable
      ? "full"
      : null;

    if (currentlySelected && !(
      (currentlySelected === "morning" && morningAvailable) ||
      (currentlySelected === "afternoon" && afternoonAvailable) ||
      (currentlySelected === "full" && fullAvailable)
    )) {
      setFormData((prev) => ({ ...prev, type: firstAvailable || "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, existingBookings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión para reservar.");
    if (!formData.date) return alert("Selecciona una fecha.");

    // Validación final: comprobar que el turno elegido está disponible
    if (
      (formData.type === "morning" && !availability.morning) ||
      (formData.type === "afternoon" && !availability.afternoon) ||
      (formData.type === "full" && !availability.full)
    ) {
      return alert("Ese turno ya no está disponible. Elige otro.");
    }

    setLoading(true);
    try {
      await createBooking({
        date: formData.date,
        type: formData.type,
        notes: formData.notes || "",
        userId: user.uid,
        userName: user.displayName || user.email.split("@")[0],
        price: formData.type === "full" ? 100 : 50,
      });
      alert("✅ Reserva creada correctamente");
      if (onSaved) await onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.message || "❌ Error al crear la reserva. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Si no hay opciones disponibles mostrará mensaje
  const anyAvailable = availability.morning || availability.afternoon || availability.full;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>Nueva Reserva</h3>

        {date && (
          <p>
            Fecha seleccionada: <strong>{date}</strong>
          </p>
        )}

        {!anyAvailable ? (
          <p className="no-available">❌ Este día está completamente ocupado. Elige otra fecha.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Fecha</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              readOnly
            />

            <label>Turno</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="morning" disabled={!availability.morning}>
                Mañana (12:00 - 17:00){!availability.morning ? " — ocupado" : ""}
              </option>
              <option value="afternoon" disabled={!availability.afternoon}>
                Tarde (18:00 - 24:00){!availability.afternoon ? " — ocupado" : ""}
              </option>
              <option value="full" disabled={!availability.full}>
                Día completo{!availability.full ? " — no disponible" : ""}
              </option>
            </select>

            <label>Descripción / Notas (opcional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Ej. cumpleaños, comida, etc."
            />

            <div className="modal-buttons">
              <button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </button>
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReservationModal;


