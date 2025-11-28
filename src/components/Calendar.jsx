// src/components/Calendar.jsx

import { useState, useEffect } from "react";
import "../styles/components/Calendar.scss";
import { auth } from "../firebaseConfig";
import { ArrowLeft, ArrowRight } from "lucide-react";

function Calendar({ bookings = [], onDayClick, onMonthChange }) {
  const [month, setMonth] = useState(new Date());
  const [days, setDays] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (bookings) generateCalendar();
    // Cuando cambie el mes, notificamos al padre
    if (onMonthChange) {
      onMonthChange(month.getMonth() + 1, month.getFullYear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, bookings, user]);

  const generateCalendar = () => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const totalDays = lastDay.getDate();
    const todayStr = new Date().toISOString().split("T")[0];

    //Lunes = 0, Domingo = 6
    const firstWeekday = (firstDay.getDay() + 6) % 7;


    // Días del mes anterior (relleno visual)
    const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
    const prevMonthDays = [];
    for (let i = firstWeekday - 1; i >= 0; i--) {
      const dateStr = `${monthIndex === 0 ? year - 1 : year}-${String(
        monthIndex === 0 ? 12 : monthIndex
      ).padStart(2, "0")}-${String(prevMonthLastDay - i).padStart(2, "0")}`;
      prevMonthDays.push({
        day: prevMonthLastDay - i,
        date: dateStr,
        isOtherMonth: true,
      });
    }
    

    // Días del mes actual
    const currentMonthDays = [];
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(i).padStart(
        2,
        "0"
      )}`;

      const dayBookings = bookings.filter((b) => b.date === dateStr);
      let status = "available";

      if (dayBookings.length > 0) {
        const types = dayBookings.map((b) => b.type);
        if (types.includes("full") || (types.includes("morning") && types.includes("afternoon"))) {
          status = "full";
        } else if (types.includes("morning")) {
          status = "morning";
        } else if (types.includes("afternoon")) {
          status = "afternoon";
        }
      }

      const bookedByUser = dayBookings.some((b) => b.userId === user?.uid);

      currentMonthDays.push({
        day: i,
        date: dateStr,
        status,
        isToday: dateStr === todayStr,
        bookedByUser,
        isOtherMonth: false,
      });
    }
    

    // Días del siguiente mes (relleno hasta 42 celdas)
    const nextMonthDays = [];
    const totalCells = [...prevMonthDays, ...currentMonthDays].length;
    const remainingCells = 42 - totalCells;

    for (let i = 1; i <= remainingCells; i++) {
      const dateStr = `${monthIndex === 11 ? year + 1 : year}-${String(
        monthIndex === 11 ? 1 : monthIndex + 2
      ).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      nextMonthDays.push({
        day: i,
        date: dateStr,
        isOtherMonth: true,
      });
    }


    setDays([...prevMonthDays, ...currentMonthDays, ...nextMonthDays]);
  };

  // 🔹 Navegación de mes anterior/siguiente
  const prevMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  const nextMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));

  // const currentYear = new Date().getFullYear();
  
  return (
    <div className="calendar">
      {/* Cabecera del mes */}
      <div className="calendar-header">
        <button onClick={prevMonth}>
          <ArrowLeft  className="arrow"/>
        </button>
        <h3>{month.toLocaleString("es-ES", { month: "long", year: "numeric" })}</h3>
        <button onClick={nextMonth}>
          <ArrowRight className="arrow"/>
        </button>
      </div>

      {/* Días de la semana */}
      <div className="calendar-weekdays">
        {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
          <div key={d} className="weekday">
            {d}
          </div>
        ))}
      </div>

      {/* Grid del calendario */}
      <div className="calendar-grid">
        {days.map((d) => {
          const today = new Date();
          const dayDate = new Date(d.date);
          const isPast = dayDate < new Date(today.toISOString().split("T")[0]);
          const isDifferentYear = dayDate.getFullYear() !== today.getFullYear();
          const isDisabled =
            d.isOtherMonth || d.status === "full" || isPast || isDifferentYear;

          return (
            <div
              key={d.date}
              className={`day ${d.status || ""} ${d.isToday ? "today" : ""} ${
                d.bookedByUser ? "user-booking" : ""
              } ${d.isOtherMonth ? "other-month" : ""} ${
                isDisabled ? "disabled" : ""
              }`}
              onClick={() => {
                if (!isDisabled && onDayClick) onDayClick(d.date);
              }}
              title={
                d.bookedByUser
                  ? "Tu reserva"
                  : d.status === "full"
                  ? "Ocupado todo el día"
                  : d.status === "morning"
                  ? "Disponible por la tarde"
                  : d.status === "afternoon"
                  ? "Disponible por la mañana"
                  : "Disponible"
              }
            >
              {d.day}
            </div>

          );
        })}
      </div>

      {/* Leyenda */}
      <div className="legend">
        <div><span className="color available"></span> Libre</div>
        <div><span className="color morning"></span> Ocupado por la mañana</div>
        <div><span className="color afternoon"></span> Ocupado por la tarde</div>
        <div><span className="color full"></span> Ocupado todo el día</div>
        <div><span className="color user-booking"></span> Tus reservas</div>
        <div><span className="color today"></span> Hoy</div>
      </div>
    </div>
  );
}

export default Calendar;




