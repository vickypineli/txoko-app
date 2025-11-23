// src/pages/HomePage.jsx

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

import { getAllBookings, getUserBookings } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

import Calendar from "../components/Calendar";
import ReservationModal from "../components/ReservationModal";
import BookingsList from "../components/BookingsList";

import { Utensils } from "lucide-react";
import { getInitials } from "../utils/format";
import { getAvatarColor } from "../utils/colors";
import "../styles/pages/HomePage.scss";

function HomePage() {
  const navigate = useNavigate();
  const { user, profile, isAdmin, loading } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();


  // 1. Cargar reservas globales + reservas del usuario SOLO cuando user y profile están listos
  useEffect(() => {
    if (!user || loading) return;
    loadAllBookings();
    loadUserBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const loadAllBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
      console.log("All bookings:", data);
    } catch (err) {
      console.error("Error al obtener reservas:", err);
    }
  };

  const loadUserBookings = async () => {
    try {
      if (!user) return;
      const data = await getUserBookings(user.uid);
      setUserBookings(data);
      console.log("User bookings:", data);
    } catch (err) {
      console.error("Error al obtener reservas del usuario:", err);
    }
  };

  // 2. Filtrado unificado según rol 
  const sourceBookings = useMemo(
    () => (isAdmin ? bookings : userBookings),
    [isAdmin, bookings, userBookings]
  );

  const filteredBookings = useMemo(() => {
    return sourceBookings
      .filter((b) => {
        const d = new Date(b.date);
        return (
          d.getMonth() + 1 === selectedMonth &&
          d.getFullYear() === selectedYear
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [sourceBookings, selectedMonth, selectedYear]);

  // ------------------------------
  // 3. Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  // 4. Apertura de modal
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  // Loading global — ya no hay flickers ni race conditions
  if (loading) return <p className="loading">Cargando...</p>;

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="logo-box">
          <Utensils className="logo-svg" size={60} aria-hidden="true" />
          <h1 className="home-title">Txoko-App</h1>
        </div>

        {user && profile && (
          <div className="user-header">
            <div
              className="user-avatar"
              style={{ backgroundColor: getAvatarColor(user.uid) }}
              onClick={() => navigate("/profile")}
            >
              {getInitials(profile.nombre, profile.apellidos)}
            </div>

            <div className="user-actions">
              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="btn-small admin"
                >
                  Admin
                </button>
              )}

              <button
                onClick={() => navigate("/profile")}
                className="btn-small"
              >
                Mi Perfil
              </button>

              <button onClick={handleLogout} className="btn-small logout">
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Calendar header */}
      <section className="calendar-header">
        <h2>Calendario de Reservas</h2>
        <p className="calendar-info">
          Solo se pueden reservar fechas dentro del año{" "}
          <strong>{currentYear}</strong>.
        </p>
      </section>

      <div className="calendar-container">
        {/* Calendario */}
        <div className="calendar-section">
          <Calendar
            bookings={bookings}
            onDayClick={handleDayClick}
            onMonthChange={(month, year) => {
              setSelectedMonth(month);
              setSelectedYear(year);
            }}
          />
        </div>

        {/* Lista de reservas */}
        <div className="bookings-section">
          <h3>
            Reservas de{" "}
            {new Date(selectedYear, selectedMonth - 1).toLocaleString(
              "es-ES",
              { month: "long", year: "numeric" }
            )}
          </h3>
          <BookingsList bookings={filteredBookings} />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ReservationModal
          date={selectedDate}
          existingBookings={bookings.filter(
            (b) =>
              new Date(b.date).toDateString() ===
              new Date(selectedDate).toDateString()
          )}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            loadAllBookings();
            loadUserBookings();
          }}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}

export default HomePage;





