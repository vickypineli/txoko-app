//src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";
import ReservationModal from "../components/ReservationModal";
import "../styles/pages/HomePage.scss";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Obtener nombre del usuario logueado
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Si el usuario tiene displayName (por login con Google), úsalo
      setUserName(user.displayName || user.email.split("@")[0]);
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  return (
    <div className="home-page">
      {/* Cabecera con usuario y opciones */}
      <header className="home-header">
        <div className="user-info">
          <p className="username">👤 {userName}</p>
          <div className="user-actions">
            <button onClick={() => navigate("/profile")} className="btn-small">
              Editar Perfil
            </button>
            <button onClick={handleLogout} className="btn-small logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Calendario */}
      <section className="calendar-section">
        <h2>Calendario de Reservas</h2>
        <Calendar />
      </section>

      {/* Acciones inferiores */}
      <div className="actions">
        <button onClick={() => alert("Función para añadir reserva próxima...")}>
          ➕ Añadir Reserva
        </button>
        <button onClick={() => setShowModal(true)}>📋 Historial de Reservas</button>
      </div>

      {showModal && <ReservationModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default HomePage;

