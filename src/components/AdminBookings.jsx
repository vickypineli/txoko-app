// src/components/AdminBookings.jsx
import { useEffect, useState } from "react";
import {
  getAllBookings,
  updateBooking,
  deleteBooking,
} from "../services/bookingService";
import "../styles/components/AdminBookings.scss";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedBooking, setEditedBooking] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const data = await getAllBookings();
    setBookings(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
  };

  const handleEdit = (booking) => {
    setEditingId(booking.id);
    setEditedBooking(booking);
  };

  const handleSave = async () => {
    try {
      await updateBooking(editingId, editedBooking);
      setEditingId(null);
      loadBookings();
    } catch (err) {
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
                  name="userName"
                  value={editedBooking.userName}
                  onChange={handleChange}
                />

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

