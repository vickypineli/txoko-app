// src/components/ReservationModal.jsx
import { useState, useEffect } from "react";
import { createBooking } from "../services/bookingService";
import { getAllUsers, getUser } from "../services/userService";
import { auth } from "../firebaseConfig";
import "../styles/components/ReservationModal.scss";

function ReservationModal({ date, existingBookings = [], onClose, onSaved, isAdmin = false }) {
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
  // Cargar datos del usuario logueado si NO es admin
  const user = auth.currentUser;

    useEffect(() => {
      if (!isAdmin && user) {
        // El usuario normal NO elige usuario → lo rellenamos automáticamente
        // getUserById(user.uid).then(profile => {
        getUser(user.uid).then(profile => {
          if (profile) {
            setFormData(prev => ({
              ...prev,
              userId: profile.id,
              userName: `${profile.nombre} ${profile.apellidos}`.trim()
            }));
          }
        });
      }
    }, [isAdmin, user]);

  // Si NO es admin, autocompletar usuario
  useEffect(() => {
    if (!isAdmin && user) {
      setFormData(prev => ({
        ...prev,
        userId: user.uid,
        userName: user.displayName || user.email || "Usuario"
      }));
    }
  }, [isAdmin, user]);

  // Sincronizar la fecha entrante
  useEffect(() => {
    if (date) setFormData(prev => ({ ...prev, date }));
  }, [date]);

  // Cargar usuarios si es admin
  useEffect(() => {
    if (isAdmin) {
      getAllUsers().then(all => {
        const filtered = all.filter(u => u.email !== "admin@admin.com");
        setUsers(filtered);
      }).catch(err => console.error("Error cargando usuarios:", err));
    }
  }, [isAdmin]);



  // Calcular disponibilidad
  useEffect(() => {
    const reservedTypes = existingBookings.map(b => b.type);
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
      fullAvailable = false;
    } else if (hasAfternoon) {
      morningAvailable = true;
      afternoonAvailable = false;
      fullAvailable = false;
    }

    setAvailability({ morning: morningAvailable, afternoon: afternoonAvailable, full: fullAvailable });

    // Ajustar tipo seleccionado si ya no está disponible
    const current = formData.type;
    const firstAvailable = morningAvailable ? "morning" : afternoonAvailable ? "afternoon" : fullAvailable ? "full" : null;
    if (current && !((current === "morning" && morningAvailable) || (current === "afternoon" && afternoonAvailable) || (current === "full" && fullAvailable))) {
      setFormData(prev => ({ ...prev, type: firstAvailable || "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, existingBookings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión para reservar.");
    if (!formData.date) return alert("Selecciona una fecha.");
    if (!isAdmin && !formData.userId) {
      return alert("No se pudo identificar el usuario logueado.");
    }

    if (isAdmin && !formData.userId) {
      return alert("Debes seleccionar un usuario.");
    }

    if ((formData.type === "morning" && !availability.morning) ||
        (formData.type === "afternoon" && !availability.afternoon) ||
        (formData.type === "full" && !availability.full)) {
      return alert("Ese turno ya no está disponible. Elige otro.");
    }

    setLoading(true);
    try {
      await createBooking({
        date: formData.date,
        type: formData.type,
        notes: formData.notes || "",
        userId: formData.userId,
        userName: formData.userName,
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

  const anyAvailable = availability.morning || availability.afternoon || availability.full;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h3>Nueva Reserva</h3>

        {date && <p>Fecha seleccionada: <strong>{date}</strong></p>}

        {!anyAvailable ? (
          <p className="no-available">❌ Este día está completamente ocupado. Elige otra fecha.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Fecha</label>
            <input type="date" name="date" value={formData.date} readOnly />

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

            {isAdmin && users.length > 0 && (
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
                        userName: `${selected.nombre} ${selected.apellidos}`.trim()
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

            <label>Descripción / Notas (opcional)</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Ej. cumpleaños, comida, etc." />

            <div className="modal-buttons">
              <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
              <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReservationModal;




