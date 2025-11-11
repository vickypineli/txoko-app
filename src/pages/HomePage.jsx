// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { getAllBookings } from "../services/bookingService";
import { getUserProfile } from "../services/userService";
import Calendar from "../components/Calendar";
import ReservationModal from "../components/ReservationModal";
import { Utensils } from "lucide-react";
import "../styles/pages/HomePage.scss";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [userName, setUserName] = useState("");
  const [bookings, setBookings] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || user.email.split("@")[0]);
        await loadUser(user.uid);
        await loadBookings();
      } else {
        navigate("/auth");
      }
    });
    return () => unsubscribe();
  }, [userName, navigate]);

  const loadUser = async (uid) => {
    try {
      const userData = await getUserProfile(uid);
      setUserProfile(userData);
    } catch (error) {
      console.error("Error al cargar el perfil del usuario:", error);
    }
  };

  const loadBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error("Error al cargar reservas:", err);
    }
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

  const getInitials = (profile) => {
    if (!profile) return "";
    const nombre = profile.nombre?.trim().split(" ")[0] || "";
    const apellidos = profile.apellidos?.trim().split(" ")[0] || "";
    return (nombre.charAt(0) + (apellidos.charAt(0) || "")).toUpperCase();
  };

  const getAvatarColor = (uid) => {
    if (!uid) return "hsla(210, 71%, 39%, 1.00)";
    const hue = Array.from(uid).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
    return `hsl(${hue}, 60%, 45%)`;
  };

  

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="logo-box">
          <Utensils className="logo-svg" size={60} aria-hidden="true" />
          <h1 className="home-title">Txoko-App</h1>
        </div>

        <div className="user-header">
          {userProfile && (
            <div
              className="user-avatar"
              style={{ backgroundColor: getAvatarColor(auth.currentUser?.uid) }}
              onClick={goToProfile}
            >
              {getInitials(userProfile)}
            </div>
          )}

          <div className="user-info">
            {/* <p className="username">{userName}</p> */}
            <div className="user-actions">
              <button onClick={goToProfile} className="btn-small">Perfil</button>
              <button onClick={handleLogout} className="btn-small logout">Salir</button>
            </div>
          </div>
        </div>
      </header>

      <h2>Calendario de Reservas</h2>

      <section className="calendar-section">
        {/* <h2>Calendario de Reservas</h2> */}
        <Calendar bookings={bookings} onDayClick={handleDayClick} />
      </section>

      <div className="actions">
        <button onClick={() => setShowModal(true)}> Nueva Reserva</button>
      </div>
      <div className="lasts-booking">
        <h2>Últimas Reservas </h2>
        <p>{bookings.length > 0 ? bookings[0].date : "No hay reservas"}</p>
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

