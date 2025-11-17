// src/pages/ProfilePage.jsx
// (solo pongo lo necesario para que funcione con el nuevo modelo)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getUserBookings, deleteBooking } from "../services/bookingService";

function ProfilePage() {
  //
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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

  const loadUserProfile = async (uid) => {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) setProfile(snap.data());
  };

  const loadUserBookings = async (uid) => {
    const data = await getUserBookings(uid);
    setBookings(data);
  };

  const formatDate = (str) => {
    const [y, m, d] = str.split("-");
    return `${d}-${m}-${y}`;
  };

  if (loading) return <p>Cargando...</p>;

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="profile-page">
      <h2>Mi Perfil</h2>

      <div className="profile-card">
        <p><strong>Nombre:</strong> {profile.nombre}</p>
        <p><strong>Apellidos:</strong> {profile.apellidos}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>

      <h3>Mis Reservas</h3>
      {bookings.length === 0 ? (
        <p>No tienes reservas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Turno</th>
              <th>Notas</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{formatDate(b.date)}</td>
                <td>{b.type}</td>
                <td>{b.notes || "—"}</td>
                <td>
                  {b.date > todayStr ? (
                    <button onClick={() => deleteBooking(b.id)}>
                      Eliminar
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate("/home")}>Volver</button>
    </div>
  );
}

export default ProfilePage;

// src/pages/ProfilePage.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, db } from "../firebaseConfig";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { getUserBookings, deleteBooking } from "../services/bookingService";
// import "../styles/pages/ProfilePage.scss";

// function ProfilePage() {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState({
//     nombre: "",
//     apellidos: "",
//     direccion: "",
//     portal: "",
//     piso: "",
//     telefono: "",
//     email: "",
//   });
//   const [bookings, setBookings] = useState([]);
//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);

//   const navigate = useNavigate();

//   // Cargar datos del usuario y reservas al iniciar sesión
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         await Promise.all([
//           loadUserProfile(currentUser.uid),
//           loadUserBookings(currentUser.uid),
//         ]);
//       } else {
//         navigate("/auth");
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   // Cargar perfil del usuario
//   const loadUserProfile = async (uid) => {
//     try {
//       const snap = await getDoc(doc(db, "users", uid));
//       if (snap.exists()) setProfile(snap.data());
//     } catch (error) {
//       console.error("❌ Error al obtener perfil:", error);
//     }
//   };

//   // Cargar reservas del usuario desde bookingService
//   const loadUserBookings = async (uid) => {
//     try {
//       const data = await getUserBookings(uid);
//       setBookings(data);
//     } catch (error) {
//       console.error("❌ Error al obtener reservas del usuario:", error);
//     }
//   };

//   // Editar perfil
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async () => {
//     if (!user) return alert("Debes iniciar sesión");
//     try {
//       await updateDoc(doc(db, "users", user.uid), profile);
//       setEditing(false);
//       alert("✅ Perfil actualizado correctamente");
//     } catch (error) {
//       console.error("❌ Error al actualizar perfil:", error);
//       alert("Error al actualizar el perfil");
//     }
//   };

//   // Eliminar reserva
//   const openDeleteModal = (booking) => {
//     setSelectedBooking(booking);
//     setModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedBooking) return;
//     try {
//       await deleteBooking(selectedBooking.id);
//       setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));
//       setModalOpen(false);
//       setSelectedBooking(null);
//       alert("🗑️ Reserva eliminada correctamente");
//     } catch (error) {
//       console.error("❌ Error al eliminar reserva:", error);
//       alert("Error al eliminar la reserva.");
//     }
//   };

//   const cancelDelete = () => {
//     setModalOpen(false);
//     setSelectedBooking(null);
//   };

//   // Iniciales y color de avatar
//   const getInitials = () => {
//     const nombre = profile.nombre?.trim().split(" ")[0] || "";
//     const apellidos = profile.apellidos?.trim().split(" ")[0] || "";
//     return (nombre.charAt(0) + (apellidos.charAt(0) || "")).toUpperCase();
//   };

//   const getAvatarColor = () => {
//     const str = user?.uid || profile.nombre || "default";
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//       hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     const hue = Math.abs(hash) % 360;
//     return `hsl(${hue}, 70%, 50%)`;
//   };

//   // 📆 Formatear fecha
//   const formatDate = (dateStr) => {
//     const [year, month, day] = dateStr.split("-");
//     return `${day}-${month}-${year}`;
//   };

//   const todayStr = new Date().toISOString().split("T")[0];

//   if (loading) return <p className="loading">Cargando datos del perfil...</p>;

//   return (
//     <div className="profile-page">
//       <h2>Mi Perfil</h2>

//       <div className="profile-card">
//         <div className="avatar" style={{ backgroundColor: getAvatarColor() }}>
//           {getInitials()}
//         </div>

//         {editing ? (
//           <div className="profile-form">
//             {["nombre", "apellidos", "direccion", "telefono"].map((field) => (
//               <div key={field}>
//                 <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
//                 <input
//                   type="text"
//                   name={field}
//                   value={profile[field] || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//             ))}

//             <div className="profile-inline">
//               <div>
//                 <label>Portal:</label>
//                 <input
//                   type="text"
//                   name="portal"
//                   value={profile.portal || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <label>Piso:</label>
//                 <input
//                   type="text"
//                   name="piso"
//                   value={profile.piso || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="buttons">
//               <button className="btn-save" onClick={handleSave}>
//                 Guardar
//               </button>
//               <button className="btn-cancel" onClick={() => setEditing(false)}>
//                 Cancelar
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="profile-info">
//             <p><strong>Nombre:</strong> {profile.nombre}</p>
//             <p><strong>Apellidos:</strong> {profile.apellidos}</p>
//             <p><strong>Dirección:</strong> {profile.direccion}</p>
//             <p>
//               <strong>Portal:</strong> {profile.portal}{" "}
//               <strong>Piso:</strong> {profile.piso}
//             </p>
//             <p><strong>Teléfono:</strong> {profile.telefono}</p>
//             <p><strong>Email:</strong> {profile.email}</p>

//             <button className="btn-edit" onClick={() => setEditing(true)}>
//               Editar perfil
//             </button>
//           </div>
//         )}
//       </div>

//       <h3>Historial de Reservas</h3>
//       {bookings.length === 0 ? (
//         <p>No has realizado ninguna reserva todavía.</p>
//       ) : (
//         <div className="booking-table-container">
//           <table className="booking-table">
//             <thead>
//               <tr>
//                 <th>Fecha</th>
//                 <th>Turno</th>
//                 <th>Descripción</th>
//                 <th>Acción</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bookings.map((b) => (
//                 <tr key={b.id}>
//                   <td data-label="Fecha">{formatDate(b.date)}</td>
//                   <td data-label="Turno">
//                     {b.type === "full"
//                       ? "Día completo"
//                       : b.type === "morning"
//                       ? "Mañana"
//                       : "Tarde"}
//                   </td>
//                   <td data-label="Descripción">{b.notes || "—"}</td>
//                   <td data-label="Acción">
//                     {b.date > todayStr ? (
//                       <button
//                         className="btn-delete"
//                         onClick={() => openDeleteModal(b)}
//                       >
//                         Eliminar
//                       </button>
//                     ) : (
//                       <span className="past">—</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <button className="btn-home" onClick={() => navigate("/home")}>
//         Volver al inicio
//       </button>

//       {/*  Modal Confirmación */}
//       {modalOpen && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h4>¿Eliminar esta reserva?</h4>
//             <p>
//               {selectedBooking &&
//                 `Reserva del ${formatDate(selectedBooking.date)} (${selectedBooking.type})`}
//             </p>
//             <div className="modal-buttons">
//               <button className="btn-confirm" onClick={confirmDelete}>
//                 Sí, eliminar
//               </button>
//               <button className="btn-cancel" onClick={cancelDelete}>
//                 Cancelar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProfilePage;
