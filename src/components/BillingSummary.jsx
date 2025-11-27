// src/components/BillingSummary.jsx
import { useEffect, useMemo, useState } from "react";
import useBilling from "../hooks/useBilling";
import { useAuth } from "../context/AuthContext"; // AJUSTA ruta si tu context está en otra carpeta
import BillingChart from "./BillingChart";
import "../styles/components/BillingSummary.scss";

const displayUserName = (u) =>
  (u?.nombre || "") + (u?.apellidos ? " " + u.apellidos : "") || u?.email || u?.id || "Usuario";



function BillingSummary({ mode = "user" }) {
  const currentYear = new Date().getFullYear();
  const { user: authUser, isAdmin } = useAuth();
  const uid = authUser?.uid || null;
  const { users, loading, months, getMonthData, exportMonthPdf, lastMonthForUser } =
    useBilling({ mode, uid });

  // mes por defecto
  const defaultAdminMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(mode === "admin" ? defaultAdminMonth : lastMonthForUser);
  const [selectedUser, setSelectedUser] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Si no hay mes seleccionado, elegir el más reciente con reservas
    if (!selectedMonth) {
      setSelectedMonth(months.length > 0 ? months[0] : null);
    }
    // Si modo user y lastMonthForUser cambia, actualiza
    if (mode === "user" && lastMonthForUser && selectedMonth !== lastMonthForUser) {
      setSelectedMonth(lastMonthForUser);
    }
    // Si admin y el mes por defecto no está en months (p. ej. mes actual sin reservas),
    // mantener el defaultAdminMonth y permitir al admin elegir meses con reservas en el selector.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [months, lastMonthForUser]);

    const getYearMonths = (year) => {
    return Array.from({ length: 12 }, (_, i) => {
        const month = String(i + 1).padStart(2, "0");
        return `${year}-${month}`;
    });
    };


  // Datos del mes seleccionado con filtro de usuario
  const userFilter = mode === "admin" && selectedUser !== "all" ? selectedUser : null;
  const monthData = getMonthData({ month: selectedMonth, userId: userFilter });

  const userOptions = useMemo(() => {
    if (!users) return [{ id: "all", display: "Todos" }];
    return [{ id: "all", display: "Todos" }, ...users.map((u) => ({ id: u.id, display: displayUserName(u) }))];
  }, [users]);

  const handleExportPdf = () => {
    exportMonthPdf({ month: selectedMonth, userFilter, filename: `facturacion_${selectedMonth}.pdf` });
  };

  if (loading) return <div className="billing-loading">Cargando facturación...</div>;
  if (mode === "admin" && !isAdmin) return <div>No autorizado</div>;

  return (
    <div className="billing-summary">
      <div className="billing-header">
        <h3>{mode === "admin" ? "Facturación (todos los usuarios)" : "Mi facturación"}</h3>

        <div className="billing-controls">
          <label>Mes:</label>
          <select value={selectedMonth || ""} onChange={(e) => setSelectedMonth(e.target.value)}>
            {months.length === 0 ? (
              <option value="">— sin reservas —</option>
            ) : (
              months.map((m) => (
                <option key={m} value={m}>
                  {new Date(m + "-01").toLocaleString("es-ES", { month: "long", year: "numeric" })}
                </option>
              ))
            )}
          </select>

          {mode === "admin" && (
            <>
              <label>Usuario:</label>
              <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                {userOptions.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.display}
                  </option>
                ))}
              </select>
            </>
          )}

          <button className="btn" onClick={() => setModalOpen(true)}>
            Historial
          </button>
          <button className="btn" onClick={handleExportPdf}>
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="billing-body">
        <h4>
          {selectedMonth
            ? new Date(selectedMonth + "-01").toLocaleString("es-ES", { month: "long", year: "numeric" })
            : "—"}
        </h4>

        <p>
          <strong>Total:</strong> {Number(monthData.total || 0).toFixed(2)} €
        </p>
        {/*  GRÁFICO POR MESES -CON TOTALES DE TODO EL AÑO */}
        <div className="billing-chart-wrapper">
        <BillingChart
            data={getYearMonths(currentYear).map((m) => {
            const { total } = getMonthData({
                month: m,
                userId:
                mode === "admin" && selectedUser !== "all" ? selectedUser : null
            });

            const [year, monthNum] = m.split("-");
            const date = new Date(year, Number(monthNum) - 1, 1);

            const label = date.toLocaleString("es-ES", {
                month: "short",
                year: "2-digit",
            });

            return { month: m, label, total };
            })}
        />
        </div>
        <div className="booking-list-compact">
          {monthData.bookings.length === 0 ? (
            <p>No hay reservas en este mes.</p>
          ) : (
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  {mode === "admin" && <th>Usuario</th>}
                  <th>Tipo</th>
                  <th>Precio</th>
                  <th>Notas</th>
                </tr>
              </thead>
              <tbody>
                {monthData.bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b._dateStr}</td>
                    {mode === "admin" && <td>{b.userName || b.userId}</td>}
                    <td>{b.type}</td>
                    <td>{Number(b.price || 0).toFixed(2)} €</td>
                    <td>{b.notes || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay billing-modal">
          <div className="modal">
            <h4>Historial de reservas</h4>
            <div className="modal-controls">
              <label>Mes:</label>
              <select value={selectedMonth || ""} onChange={(e) => setSelectedMonth(e.target.value)}>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {new Date(m + "-01").toLocaleString("es-ES", { month: "long", year: "numeric" })}
                  </option>
                ))}
              </select>

              {mode === "admin" && (
                <>
                  <label>Usuario:</label>
                  <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    {userOptions.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.display}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <button className="btn" onClick={handleExportPdf}>
                Exportar PDF
              </button>
              <button className="btn btn-cancel" onClick={() => setModalOpen(false)}>
                Cerrar
              </button>
            </div>

            <div className="modal-list">
              <table className="full-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Tipo</th>
                    <th>Precio</th>
                    <th>Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {monthData.bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b._dateStr}</td>
                      <td>{b.userName || b.userId}</td>
                      <td>{b.type}</td>
                      <td>{Number(b.price || 0).toFixed(2)} €</td>
                      <td>{b.notes || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillingSummary;
