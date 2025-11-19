// src/pages/ProfilePage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getUserBookings, deleteBooking } from "../services/bookingService";
import "../styles/pages/ProfilePage.scss";

function ProfilePage() {
  const [user, setUser] = useState(null);
  // const [profile, setProfile] = useState({});
  const [profile, setProfile] = useState({
    nombre: "",
    apellidos: "",
    direccion: "",
    portal: "",
    piso: "",
    telefono: "",
    email: "",
  });
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const navigate = useNavigate();

  // Cargar datos del usuario y reservas al iniciar sesión
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) return navigate("/auth");

      setUser(u);
      await loadUserProfile(u.uid);
      await loadUserBookings(u.uid);

      setLoading(false);
    });

    return () => unsub();
  }, [navigate]);

  // Cargar perfil del usuario
  const loadUserProfile = async (uid) => {
    try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
        const data = snap.data();
        setProfile((prev) => ({
          ...prev,
          ...data,
        }));
      }
    } catch (err) {
      console.error("❌ Error al cargar perfil de usuario:", err);
    }
  };
  // Cargar reservas del usuario desde bookingService
  const loadUserBookings = async (uid) => {
  try {
    const data = await getUserBookings(uid);
    setBookings(data);
  } catch (err) {
    console.error("❌ Error al cargar reservas del usuario:", err);
  }
  };

  // Formatear fecha DD-MM-AAAA
 const formatDate = (str) => {
  if (!str) return "—";

  // Ya viene como string "YYYY-MM-DD"
  if (typeof str === "string" && str.includes("-")) {
    const [y, m, d] = str.split("-");
    return `${d}-${m}-${y}`;
  }

  // Si algún día Firestore devuelve Timestamp
  if (str?.toDate) {
    const date = str.toDate();
    return date.toLocaleDateString("es-ES");
  }

  return String(str);
};

  if (loading) return <p>Cargando...</p>;

  const todayStr = new Date().toISOString().split("T")[0];

  // Editar perfil
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  // Eliminar reserva
  const openDeleteModal = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

    const handleSave = async () => {
      if (!user) return alert("Debes iniciar sesión");

      if (!profile.nombre.trim()) return alert("El nombre no puede estar vacío");
      if (!profile.apellidos.trim()) return alert("Los apellidos no pueden estar vacíos");

      try {
        await updateDoc(doc(db, "users", user.uid), {
          nombre: profile.nombre.trim(),
          apellidos: profile.apellidos.trim(),
          direccion: profile.direccion.trim(),
          portal: profile.portal.trim(),
          piso: profile.piso.trim(),
          telefono: profile.telefono.trim(),
          email: profile.email.trim(),
        });

        setEditing(false);
        alert("✅ Perfil actualizado correctamente");
      } catch (error) {
        console.error("❌ Error al actualizar perfil:", error);
        alert("Error al actualizar el perfil");
      }
    };


   const confirmDelete = async () => {
    if (!selectedBooking) return;
    try {
      await deleteBooking(selectedBooking.id);
      setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));
      setModalOpen(false);
      setSelectedBooking(null);
      alert("🗑️ Reserva eliminada correctamente");
    } catch (error) {
      console.error("❌ Error al eliminar reserva:", error);
      alert("Error al eliminar la reserva.");
    }
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  // Iniciales y color de avatar
const getInitials = () => {
  const n = profile.nombre?.trim().split(" ")[0] || "";
  const a = profile.apellidos?.trim().split(" ")[0] || "";
  const initials = (n.charAt(0) + a.charAt(0)).toUpperCase();

  return initials || "?" // Evita avatar vacío
};

    const getAvatarColor = () => {
    const str = user?.uid || profile.nombre || "default";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };



  return (
    <div className="profile-page">
      <h2>Mi Perfil</h2>

      <div className="profile-card">
        <div className="avatar" style={{ backgroundColor: getAvatarColor() }}>
          {getInitials()}
        </div>

        {editing ? (
          <div className="profile-form">
            {["nombre", "apellidos", "direccion", "telefono"].map((field) => (
              <div key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input
                  type="text"
                  name={field}
                  value={profile[field] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className="profile-inline">
              <div>
                <label>Portal:</label>
                <input
                  type="text"
                  name="portal"
                  value={profile.portal || ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Piso:</label>
                <input
                  type="text"
                  name="piso"
                  value={profile.piso || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="buttons">
              <button className="btn-save" onClick={handleSave}>
                Guardar
              </button>
              <button className="btn-cancel" onClick={() => setEditing(false)}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <p><strong>Nombre:</strong> {profile.nombre}</p>
            <p><strong>Apellidos:</strong> {profile.apellidos}</p>
            <p><strong>Dirección:</strong> {profile.direccion}</p>
            <p>
              <strong>Portal:</strong> {profile.portal}{" "}
              <strong>Piso:</strong> {profile.piso}
            </p>
            <p><strong>Teléfono:</strong> {profile.telefono}</p>
            <p><strong>Email:</strong> {profile.email}</p>

            <button className="btn-edit" onClick={() => setEditing(true)}>
              Editar perfil
            </button>
          </div>
        )}
      </div>
      

      <h3>Mis Reservas</h3>
      {bookings.length === 0 ? (
        <p>No has realizado ninguna reserva todavía.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Notas</th>
              <th>Accion</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td data-label="Fecha">{formatDate(b.date)}</td>
                <td data-label="Turno">{b.type}</td>
                <td>{b.notes || "—"}</td>
                <td data-label="Acción">
                  {b.date > todayStr ? (
                    <button
                        className="btn-delete"
                        onClick={() => openDeleteModal(b)}
                      >
                      Eliminar
                    </button>
                  ) : (
                    <span className="past">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="btn-home" onClick={() => navigate("/home")}>
        Volver al inicio
      </button>

      
    

     {/*  Modal Confirmación */}

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>¿Eliminar esta reserva?</h4>
            <p>
              {selectedBooking &&
                `Reserva del ${formatDate(selectedBooking.date)} (${selectedBooking.type})`}
            </p>
            <div className="modal-buttons">
              <button className="btn-confirm" onClick={confirmDelete}>
                Sí, eliminar
              </button>
              <button className="btn-cancel" onClick={cancelDelete}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;


