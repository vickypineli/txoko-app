// src/components/BookingsList.jsx
import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import "../styles/components/BookingList.scss";

function BookingsList({
  bookings,
  showActions = false,
  onDelete = null,
  todayStr = null,
}) {

  useEffect(() => {
    console.log("BookingsList renderizado");
  });

  if (!bookings || bookings.length === 0) {
    return <p className="no-bookings">No hay reservas para este mes.</p>;
  }

  return (
    <div className="bookings-list">
      {bookings.map((b) => {
        const formattedDate = new Date(b.date).toLocaleDateString("es-ES");

        return (
          <div key={b.docId || b.id} className="booking-row">
            <span className={`booking-color ${b.type}`}></span>

            <div className="booking-info">
              <span className="booking-date">{formattedDate}</span>

              <span className="booking-type">
                {b.type === "morning"
                  ? "Mañana"
                  : b.type === "afternoon"
                  ? "Tarde"
                  : "Día completo"}
              </span>

              {b.notes && <span className="booking-notes">— {b.notes}</span>}
            </div>

            {/* Nuevas acciones opcionales */}
            {showActions && (
              <div className="booking-actions">
                <button
                  className={`btn-delete ${todayStr && b.date <= todayStr ? "disabled" : ""}`}
                  onClick={() =>
                    todayStr && b.date > todayStr && onDelete && onDelete(b)
                  }
                  disabled={todayStr && b.date <= todayStr}
                >
                  <Trash2 size={18} />
                </button>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BookingsList;
