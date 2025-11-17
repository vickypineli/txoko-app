// src/components/ReservationList.jsx
import React from "react";

/**
 * ReservationList
 * Props:
 *  - bookings: array de reservas ya filtradas o no (obj: { id, date, type, notes, userName })
 *  - selectedMonth: número (1-12) del mes mostrado
 *  - onMonthChange: función(newMonthNumber) -> actualizar mes en el padre
 *
 * Nota: no maneja año; conserva la misma convención simple que hay en HomePage.
 */
export default function ReservationList({ bookings = [], selectedMonth, onMonthChange }) {
  const monthName = new Date(new Date().getFullYear(), (selectedMonth || 1) - 1).toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const prev = () => {
    const m = selectedMonth - 1 <= 0 ? 12 : selectedMonth - 1;
    onMonthChange?.(m);
  };

  const next = () => {
    const m = selectedMonth + 1 > 12 ? 1 : selectedMonth + 1;
    onMonthChange?.(m);
  };

  return (
    <section className="bookings-section">
      <div className="bookings-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button type="button" onClick={prev} aria-label="Mes anterior">←</button>
          <h3 style={{ margin: 0, textTransform: "capitalize" }}>{monthName}</h3>
          <button type="button" onClick={next} aria-label="Mes siguiente">→</button>
        </div>
      </div>

      {(!bookings || bookings.length === 0) ? (
        <p className="no-bookings">No hay reservas para este mes.</p>
      ) : (
        <div className="bookings-list" style={{ marginTop: 12 }}>
          {bookings.map((b) => (
            <div key={b.id} className="booking-row" style={{ display: "flex", gap: 12, padding: 8, borderBottom: "1px solid #eee", alignItems: "center" }}>
              <span style={{ width: 10, height: 10, borderRadius: 4, background: b.type === "full" ? "#9b5cf6" : b.type === "morning" ? "#f59e0b" : "#06b6d4" }} aria-hidden />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {new Date(b.date).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </div>
                    <div style={{ fontSize: 13, color: "#555" }}>
                      {b.type === "morning" ? "Mañana" : b.type === "afternoon" ? "Tarde" : "Día completo"}
                      {b.notes ? ` — ${b.notes}` : ""}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 13, color: "#333" }}>
                    <div>{b.userName || "Desconocido"}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
