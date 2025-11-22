// src/components/AdminBookings.jsx
import { useEffect, useState } from "react";
import {
  getAllBookings,
  updateBooking,
  deleteBooking,
} from "../services/bookingService";
import { getAllUsers } from "../services/userService";
import "../styles/components/AdminBookings.scss";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedBooking, setEditedBooking] = useState({});
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const data = await getAllBookings();
    console.log("📥 BOOKINGS RECIBIDOS:", data);
    setBookings(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
  };

  const handleEdit = (booking) => {
    console.log("✏️ ENTRANDO A EDITAR RESERVA:", booking);
    console.log("➡️ userId EN booking:", booking.userId);
    console.log("➡️ userName EN booking:", booking.userName)
    setEditingId(booking.id);
    setEditedBooking(booking);
    setUsers([]); // Reset users state
    // Cargar todos los usuarios para el select
    getAllUsers().then((all) => {
      console.log("📥 USERS RECIBIDOS:", all);
      const filtered = all.filter((u) => u.email !== "");
      setUsers(filtered);
      console.log("📥 USERS FILTRADOS:", filtered);
    }); 
  };
    const validateBooking = (data) => {
    if (!data.date) return "La fecha es obligatoria";
    if (!data.type) return "El tipo de reserva es obligatorio";
    if (!data.userId) return "Debes seleccionar un usuario";
    if (!data.userName) return "El nombre del usuario no puede quedar vacío";
    return null;
  };

  const handleSave = async () => {
    const validation = validateBooking(editedBooking);

    if (validation) {
      setErrorMsg(validation);
      return;
    }

    try {
      setErrorMsg("");

      await updateBooking(editingId, editedBooking);
      setEditingId(null);
      loadBookings();
    } catch (err) {
      setErrorMsg("Ocurrió un error al guardar la reserva");
      console.error("❌ Error guardando reserva:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta reserva?")) return;

    try {
      await deleteBooking(id);
      loadBookings();
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
    }
  };

  const handleChange = (e) => {
    setEditedBooking((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
    // 🔍 Filtrado por nombre y apellidos
  const bookingsFiltered = bookings.filter((b) =>
    b.userName.toLowerCase().includes(search.toLowerCase())
  );

return (
    <div className="admin-bookings-wrapper">
      <h2>Reservas</h2>

      {/* 🔎 BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar por nombre o apellidos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="admin-search"
      />
      
      <div className="admin-bookings">
        {bookingsFiltered.map((b) => (
          <div key={b.id} className="admin-card">
            {editingId === b.id ? (
              <>
                {/*  MENSAJE DE ERROR */}
                {errorMsg && (
                  <div className="admin-error">
                    {errorMsg}
                  </div>
                )}
              
                <input
                  type="date"
                  name="date"
                  value={editedBooking.date}
                  onChange={handleChange}
                />
                <select
                  name="type"
                  value={editedBooking.type}
                  onChange={handleChange}
                >
                  <option value="morning">Mañana</option>
                  <option value="afternoon">Tarde</option>
                  <option value="full">Día completo</option>
                </select>

                <input
                  type="text"
                  name="notes"
                  value={editedBooking.notes || ""}
                  onChange={handleChange}
                />

                {/* 
                <input
                  type="text"
                  name="userName"
                  value={editedBooking.userName}
                  onChange={handleChange}
                  disabled={true}
                /> */}
                <select
                  name="userId"
                  value={editedBooking.userId}
                  onChange={(e) => {
                    const selectedId = e.target.value;

                    const selectedUser = users.find(
                      (u) => u.id === selectedId
                    );

                    setEditedBooking((prev) => ({
                      ...prev,
                      userId: selectedId, // 🔥 string válido, no Number()
                      userName: selectedUser
                        ? `${selectedUser.nombre} ${selectedUser.apellidos}`.trim()
                        : prev.userName, // 🔥 nada de undefined
                    }));
                  }}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {`${u.nombre} ${u.apellidos}`.trim()} ({u.email})
                    </option>
                  ))}
                </select>
                <button onClick={handleSave}>Guardar</button>
                <button onClick={() => setEditingId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <div className="booking-info">
                  <span>{new Date(b.date).toLocaleDateString("es-ES")}</span>
                  <span>
                    {b.type === "morning"
                      ? "Mañana"
                      : b.type === "afternoon"
                      ? "Tarde"
                      : "Día completo"}
                  </span>
                  <span>{b.userName}</span>
                </div>

                <div className="actions">
                  <button onClick={() => handleEdit(b)}>Editar</button>
                  <button className="delete" onClick={() => handleDelete(b.id)}>
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminBookings;

