// src/components/Calendar.jsx
import { useState, useEffect } from "react";
import { listenBookingsByMonth } from "../services/bookingService";
import "../styles/components/Calendar.scss";

function Calendar() {
  const [days, setDays] = useState([]);
  const [month, setMonth] = useState(new Date());
  const [bookings, setBookings] = useState([]);

  // Escucha las reservas en tiempo real del mes actual
  useEffect(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const unsubscribe = listenBookingsByMonth(year, monthIndex, (data) => {
      setBookings(data);
    });

    return () => unsubscribe();
  }, [month]);

  // Genera los días del mes con estados según las reservas
  useEffect(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();

    const newDays = [];

    for (let i = 1; i <= lastDay; i++) {
      const dateString = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const booking = bookings.find((b) => b.date === dateString);

      let status = "available";
      if (booking) {
        status =
          booking.type === "full"
            ? "full"
            : booking.type === "morning"
            ? "morning"
            : "afternoon";
      }

      newDays.push({
        day: i,
        date: dateString,
        status,
      });
    }

    setDays(newDays);
  }, [bookings, month]);

  const prevMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>←</button>
        <h3>
          {month.toLocaleString("es-ES", { month: "long" })} {month.getFullYear()}
        </h3>
        <button onClick={nextMonth}>→</button>
      </div>

      <div className="calendar-grid">
        {days.map((d) => (
          <div
            key={d.date}
            className={`day ${d.status}`}
            title={
              d.status === "available"
                ? "Libre"
                : d.status === "full"
                ? "Día completo reservado"
                : d.status === "morning"
                ? "Reservado por la mañana"
                : "Reservado por la tarde"
            }
          >
            {d.day}
          </div>
        ))}
      </div>

      <div className="legend">
        <div><span className="color full"></span> Día completo</div>
        <div><span className="color morning"></span> Mañana</div>
        <div><span className="color afternoon"></span> Tarde</div>
        <div><span className="color available"></span> Libre</div>
      </div>
    </div>
  );
}

export default Calendar;

