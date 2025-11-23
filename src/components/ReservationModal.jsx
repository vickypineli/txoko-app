// src/components/ReservationModal.jsx
import { useState, useEffect } from "react";
import { createBooking } from "../services/bookingService";
import { getAllUsers } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading"; 
import "../styles/components/ReservationModal.scss";

function ReservationModal({ date, existingBookings = [], onClose, onSaved, isAdmin = false }) {
  const { user, profile } = useAuth(); // SE COGEN LOS DATOS DEL USUARIO Ya no usamos getUser()
  
  const [formData, setFormData] = useState({
    date: date || "",
    type: "morning",
    notes: "",
    userId: "",
    userName: "",
  });

  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState({
    morning: true,
    afternoon: true,
    full: true,
  });

  const [users, setUsers] = useState([]);

  // SE SINCRONIZA LA FECHA ENTRANTE
   useEffect(() => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  }, [date]);

  // Si NO es admin: autocompletar usuario desde AuthContext
  useEffect(() => {
    if (!isAdmin && profile) {
      setFormData(prev => ({
        ...prev,
        userId: profile.id || user?.uid,
        userName: `${profile.nombre} ${profile.apellidos}`.trim(),
      }));
    }
  }, [isAdmin, profile, user]);

  // Si es admin, cargar lista de usuarios
  useEffect(() => {
    if (isAdmin) {
      getAllUsers()
        .then(all => {
          const filtered = all.filter(u => u.email !== "admin@admin.com");
          setUsers(filtered);
        })
        .catch(err => console.error("Error cargando usuarios:", err));
    }
  }, [isAdmin]);

  // Calcular disponibilidad
  useEffect(() => {
    const reserved = existingBookings.map(b => b.type);

    const hasFull = reserved.includes("full");
    const hasMorning = reserved.includes("morning");
    const hasAfternoon = reserved.includes("afternoon");

    const newAvail = {
      morning: !hasFull && !hasMorning,
      afternoon: !hasFull && !hasAfternoon,
      full: !hasFull && !(hasMorning && hasAfternoon),
    };

    setAvailability(newAvail);

    // Ajuste automático del tipo DE RESERVA, cuando el seleccionado no está libre
    if (!newAvail[formData.type]) {
      const first = newAvail.morning
        ? "morning"
        : newAvail.afternoon
        ? "afternoon"
        : newAvail.full
        ? "full"
        : "";

      setFormData(prev => ({ ...prev, type: first }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingBookings]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!user) return alert("Debes iniciar sesión.");
    if (!formData.date) return alert("Selecciona una fecha.");
    if (!formData.userId) return alert("No se pudo identificar el usuario.");

    if (!availability[formData.type]) {
      return alert("Ese turno ya no está disponible.");
    }

    setLoading(true);

    try {
      await createBooking({
        ...formData,
        price: formData.type === "full" ? 100 : 50,
      });

      if (onSaved) await onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar.");
    } finally {
      setLoading(false);
    }
  };

  const anyAvailable = availability.morning || availability.afternoon || availability.full;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>Nueva Reserva</h3>

        {date && <p>Fecha seleccionada: <strong>{date}</strong></p>}

        {!anyAvailable ? (
          <p className="no-available">❌ Día completo ocupado.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Fecha</label>
            <input type="date" name="date" value={formData.date} readOnly />

            <label>Turno</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="morning" disabled={!availability.morning}>
                Mañana (12–17){!availability.morning && " — ocupado"}
              </option>
              <option value="afternoon" disabled={!availability.afternoon}>
                Tarde (18–24){!availability.afternoon && " — ocupado"}
              </option>
              <option value="full" disabled={!availability.full}>
                Día completo{!availability.full && " — no disponible"}
              </option>
            </select>

            {isAdmin && (
              <>
                <label>Usuario</label>
                <select
                  name="userId"
                  value={formData.userId}
                  onChange={(e) => {
                    const selected = users.find(u => u.id === e.target.value);
                    if (selected) {
                      setFormData(prev => ({
                        ...prev,
                        userId: selected.id,
                        userName: `${selected.nombre} ${selected.apellidos}`.trim(),
                      }));
                    }
                  }}
                  required
                >
                  <option value="">-- Seleccionar usuario --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {`${u.nombre} ${u.apellidos}`.trim()} ({u.email})
                    </option>
                  ))}
                </select>
              </>
            )}

            <label>Notas</label>
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


