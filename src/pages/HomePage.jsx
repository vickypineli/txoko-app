// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getAllBookings, getUserBookings } from "../services/bookingService";
import { getUserById } from "../services/userService";
import Calendar from "../components/Calendar";
import ReservationModal from "../components/ReservationModal";
import { Utensils } from "lucide-react";
import { useAuthUser } from "../hooks/useAuthUser";
import { getInitials } from "../utils/format";
import { getAvatarColor } from "../utils/colors";
import "../styles/pages/HomePage.scss";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingsByUser, setBookingsByUser] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const navigate = useNavigate();
  const { user, profile, loading } = useAuthUser();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
      const current = auth.currentUser;

      if (!current) return;

      getUserById(current.uid).then(profile => {
        if (!profile) return;

        setIsAdmin(profile.role === "admin"); // o como estés guardando el campo role
      });
    }, []);

  // eslint-disable-next-line no-unused-vars
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      loadBookings();
      loadUserBookings();
      console.log("Usuario en HomePage:", user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
      console.log("RESERVAS TOTALES:", data);
    } catch (err) {
      console.error("Error al cargar reservas:", err);
    }
  };

  const loadUserBookings = async () => {
    try {
      if (!user) return;
      const data = await getUserBookings(user.uid);
      console.log("Reservas del usuario cargadas:", data);
      setBookingsByUser(data);
    } catch (err) {
      console.error("Error al cargar reservas del usuario:", err);
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  // Ir al perfil
  const goToProfile = () => navigate("/profile");

  // Clic en día del calendario
  const handleDayClick = (date) => {
    console.log("Día seleccionado:", date);
    setSelectedDate(date);
    setShowModal(true);
  };

  // Filtrar reservas del usuario según mes visible en el calendario
const filteredBookings =
  user?.email === "admin@admin.com"
    ? bookings
        .filter((b) => {
          const d = new Date(b.date);
          return (
            d.getMonth() + 1 === selectedMonth &&
            d.getFullYear() === selectedYear
          );
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    : bookingsByUser
        .filter((b) => {
          const d = new Date(b.date);
          return (
            d.getMonth() + 1 === selectedMonth &&
            d.getFullYear() === selectedYear
          );
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
if (loading) return <p className="loading">Cargando...</p>;


console.log("Booking dates:", bookingsByUser.map(b => b.date));
console.log("Mes/Año visibles:", selectedMonth, selectedYear);

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
              onClick={goToProfile}
            >
              {getInitials(profile.nombre, profile.apellidos)}
            </div>

            <div className="user-actions">
              {user?.email === "admin@admin.com" && (
                <button onClick={() => navigate("/admin")} className="btn-small admin">
                  Admin
                </button>
              )}
              <button onClick={goToProfile} className="btn-small">
                Mi Perfil
              </button>
              <button onClick={handleLogout} className="btn-small logout">
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </header>

      <section className="calendar-header">
        <h2>Calendario de Reservas</h2>
        <p className="calendar-info">
          Solo se pueden reservar fechas dentro del año <strong>{currentYear}</strong>.
        </p>
      </section>

      {/* Calendario */}
      <div className="calendar-container">
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

        {/* Reservas filtradas por mes */}
        <div className="bookings-section">
          <h3>
            Reservas de{" "}
            {new Date(selectedYear, selectedMonth - 1).toLocaleString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </h3>

          {filteredBookings.length === 0 ? (
            <p className="no-bookings">No hay reservas para este mes.</p>
          ) : (
            <div className="bookings-list">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="booking-row">
                  <span className={`booking-color ${booking.type}`}></span>
                  <div className="booking-info">
                    <span className="booking-date">
                      {new Date(booking.date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    <span className="booking-type">
                      {booking.type === "morning"
                        ? "Mañana"
                        : booking.type === "afternoon"
                        ? "Tarde"
                        : "Día completo"}
                    </span>
                    {booking.notes && <span className="booking-notes">— {booking.notes}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de reservas */}
      {showModal && (
        <ReservationModal
          date={selectedDate}
          existingBookings={bookings.filter((b) => b.date === selectedDate)}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            loadBookings();
            loadUserBookings();
          }}
          isAdmin={user?.email === "admin@admin.com"}
        />
      )}
    </div>
  );
}

export default HomePage;




