// src/pages/AdminPage.jsx

import { useNavigate } from "react-router-dom";
import AdminUsers from "../components/AdminUsers";
import AdminBookings from "../components/AdminBookings";
import "../styles/pages/AdminPage.scss";

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <header>
        <h1>Panel de Administración</h1>
        <button onClick={() => navigate("/home")}>⬅ Volver</button>
      </header>
      <AdminBookings />
      <AdminUsers />
    </div>
  );
}

export default AdminPage;


// // src/pages/AdminPage.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getAllBookingsAdmin,
//   updateBooking,
//   deleteBooking,
//   createBooking,
// } from "../services/bookingService";
// import Modal from "../components/Modal";
// import "../styles/pages/AdminPage.scss";

// function AdminPage() {
//   const [bookings, setBookings] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editedBooking, setEditedBooking] = useState({});
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [newBooking, setNewBooking] = useState({
//     date: "",
//     type: "morning",
//     userName: "",
//     userId: "",
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   const loadBookings = async () => {
//     try {
//       const data = await getAllBookingsAdmin();
//       setBookings(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
//     } catch (error) {
//       console.error("Error al cargar reservas:", error);
//     }
//   };

//   const handleEdit = (booking) => {
//     setEditingId(booking.id);
//     setEditedBooking(booking);
//   };

//   const handleSave = async () => {
//     try {
//       await updateBooking(editingId, editedBooking);
//       setEditingId(null);
//       loadBookings();
//     } catch (error) {
//       console.error("Error al actualizar reserva:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       if (window.confirm("¿Seguro que deseas eliminar esta reserva?")) {
//         await deleteBooking(id);
//         loadBookings();
//       }
//     } catch (error) {
//       console.error("Error al eliminar reserva:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedBooking({ ...editedBooking, [name]: value });
//   };

//   const handleNewBookingChange = (e) => {
//     const { name, value } = e.target;
//     setNewBooking((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCreateBooking = async (e) => {
//     e.preventDefault();
//     try {
//       await createBooking(newBooking);
//       alert("✅ Reserva creada correctamente");
//       setNewBooking({ date: "", type: "morning", userName: "", userId: "" });
//       setShowBookingForm(false);
//       loadBookings();
//     } catch (error) {
//       console.error("Error al crear reserva:", error);
//       alert(error.message || "❌ No se pudo crear la reserva.");
//     }
//   };

//   return (
//     <div className="admin-page">
//       <header>
//         <h1>Panel de Administración</h1>
//         <div className="header-actions">
//           <button className="btn-back" onClick={() => navigate("/home")}>
//             ⬅ Volver
//           </button>
//           <button
//             className="btn-new-booking"
//             onClick={() => setShowBookingForm(true)}
//           >
//             📅 Nueva Reserva
//           </button>
//         </div>
//       </header>

//       {/* Modal flotante para crear reserva */}
//       <Modal isOpen={showBookingForm} onClose={() => setShowBookingForm(false)}>
//         <h2>Nueva Reserva</h2>
//         <form className="new-booking-form" onSubmit={handleCreateBooking}>
//           <input
//             type="date"
//             name="date"
//             value={newBooking.date}
//             onChange={handleNewBookingChange}
//             required
//           />
//           <select
//             name="type"
//             value={newBooking.type}
//             onChange={handleNewBookingChange}
//           >
//             <option value="morning">Mañana</option>
//             <option value="afternoon">Tarde</option>
//             <option value="full">Día completo</option>
//           </select>
//           <input
//             type="text"
//             name="userName"
//             placeholder="Nombre de usuario"
//             value={newBooking.userName}
//             onChange={handleNewBookingChange}
//             required
//           />
//           <button type="submit" className="btn-save">
//             Crear reserva
//           </button>
//         </form>
//       </Modal>

//       {/* Lista de reservas */}
//       {bookings.length === 0 ? (
//         <p>No hay reservas registradas.</p>
//       ) : (
//         <div className="admin-bookings">
//           {bookings.map((b) => (
//             <div key={b.id} className="admin-booking">
//               {editingId === b.id ? (
//                 <>
//                   <input
//                     type="date"
//                     name="date"
//                     value={editedBooking.date}
//                     onChange={handleChange}
//                   />
//                   <select
//                     name="type"
//                     value={editedBooking.type}
//                     onChange={handleChange}
//                   >
//                     <option value="morning">Mañana</option>
//                     <option value="afternoon">Tarde</option>
//                     <option value="full">Día completo</option>
//                   </select>
//                   <input
//                     type="text"
//                     name="userName"
//                     placeholder="Usuario"
//                     value={editedBooking.userName || ""}
//                     onChange={handleChange}
//                   />
//                   <button className="btn-save" onClick={handleSave}>
//                     Guardar
//                   </button>
//                   <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancelar</button>
//                 </>
//               ) : (
//                 <>
//                   <div className="booking-info">
//                     <span>
//                       {new Date(b.date).toLocaleDateString("es-ES")}
//                     </span>
//                     <span>
//                       {b.type === "morning"
//                         ? "Mañana"
//                         : b.type === "afternoon"
//                         ? "Tarde"
//                         : "Día completo"}
//                     </span>
//                     <span>{b.userName || "Desconocido"}</span>
//                   </div>
//                   <div className="actions">
//                     <button onClick={() => handleEdit(b)}>Editar</button>
//                     <button
//                       onClick={() => handleDelete(b.id)}
//                       className="delete"
//                     >
//                       Eliminar
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminPage;





