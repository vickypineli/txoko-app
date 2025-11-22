//src/components/BookingsList.jsx


function BookingsList({ bookings }) {
  if (!bookings || bookings.length === 0) {
    return <p className="no-bookings">No hay reservas para este mes.</p>;
  }

  return (
    <div className="bookings-list">
      {bookings.map((b) => (
        <div key={b.docId || b.id} className="booking-row">
          <span className={`booking-color ${b.type}`}></span>

          <div className="booking-info">
            <span className="booking-date">
              {new Date(b.date).toLocaleDateString("es-ES")}
            </span>

            <span className="booking-type">
              {b.type === "morning"
                ? "Mañana"
                : b.type === "afternoon"
                ? "Tarde"
                : "Día completo"}
            </span>

            {b.notes && (
              <span className="booking-notes">— {b.notes}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookingsList;
