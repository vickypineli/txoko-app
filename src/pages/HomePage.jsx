import Calendar from "../components/Calendar";
import ReservationModal from "../components/ReservationModal";
import "../styles/pages/HomePage.scss";
import { useState } from "react";

function HomePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="home-page">
      <h2>Calendario de Reservas</h2>
      <Calendar />

      <div className="actions">
        <button onClick={() => setShowModal(true)}>Historial de Reservas</button>
        <button onClick={() => alert("Función para añadir reserva próxima...")}>
          Añadir Reserva
        </button>
      </div>

      {showModal && <ReservationModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default HomePage;
