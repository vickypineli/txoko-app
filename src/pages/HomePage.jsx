// src/pages/HomePage.jsx
// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import ReservationModal from "../components/ReservationModal";
import { getAllBookings } from "../services/bookingService";
import "../styles/pages/HomePage.scss";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [userName, setUserName] = useState("");
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || user.email.split("@")[0]);
      loadBookings();
    }
  }, []);

  const loadBookings = async () => {
    const data = await getAllBookings();
    setBookings(data);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  const goToProfile = () => navigate("/profile");

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="user-info">
          <p className="username">👤 {userName}</p>
          <div className="user-actions">
            <button onClick={goToProfile} className="btn-small">Editar Perfil</button>
            <button onClick={handleLogout} className="btn-small logout">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <section className="calendar-section">
        <h2>Calendario de Reservas</h2>
        <Calendar bookings={bookings} onDayClick={handleDayClick} />
      </section>

      <div className="actions">
        <button onClick={() => setShowModal(true)}>➕ Añadir Reserva</button>
        <button onClick={loadBookings}>🔄 Actualizar Calendario</button>
      </div>

      {showModal && (
        <ReservationModal
          date={selectedDate}
          existingBookings={bookings.filter((b) => b.date === selectedDate)}
          onClose={() => setShowModal(false)}
          onSaved={loadBookings}
        />
      )}
    </div>
  );
}

export default HomePage;
