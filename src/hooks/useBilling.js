// src/hooks/useBilling.js
import { useEffect, useMemo, useState } from "react";
import { getAllBookings, getUserBookings } from "../services/bookingService";
import { getAllUsers } from "../services/userService";
import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * useBilling({ mode: "admin"|"user", uid: string|null })
 */
export default function useBilling({ mode = "user", uid = null }) {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        if (mode === "admin") {
          const all = await getAllBookings();
          if (!mounted) return;
          setBookings(all);
          const u = await getAllUsers();
          if (!mounted) return;
          setUsers(u);
        } else {
          if (!uid) {
            setBookings([]);
          } else {
            const my = await getUserBookings(uid);
            if (!mounted) return;
            setBookings(my);
          }
        }
      } catch (err) {
        console.error("useBilling load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [mode, uid]);

  // Normaliza cada booking: fecha string y mes "YYYY-MM"
  const bookingsWithMeta = useMemo(
    () =>
      bookings.map((b) => {
        let dateStr = b.date;
        if (!dateStr && b?.date?.toDate) {
          dateStr = b.date.toDate().toISOString().split("T")[0];
        }
        const month = dateStr ? dateStr.slice(0, 7) : "unknown";
        return { ...b, _dateStr: dateStr, _month: month };
      }),
    [bookings]
  );

  // meses disponibles (solo con reservas) orden descendente (más reciente primero)
  const months = useMemo(() => {
    const s = new Set();
    bookingsWithMeta.forEach((b) => {
      if (b._month && b._month !== "unknown") s.add(b._month);
    });
    return Array.from(s).sort((a, b) => (a < b ? 1 : -1));
  }, [bookingsWithMeta]);

  // agrupación por mes
  const groupedByMonth = useMemo(() => {
    const map = {};
    bookingsWithMeta.forEach((b) => {
      const m = b._month || "unknown";
      if (!map[m]) map[m] = { bookings: [], total: 0 };
      map[m].bookings.push(b);
    });
    // calcular totales
    Object.keys(map).forEach((m) => {
      map[m].total = map[m].bookings.reduce((acc, x) => acc + (Number(x.price) || 0), 0);
    });
    return map;
  }, [bookingsWithMeta]);

  const getMonthData = ({ month, userId = null }) => {
    if (!month) return { bookings: [], total: 0 };
    const entry = groupedByMonth[month];
    if (!entry) return { bookings: [], total: 0 };
    let list = entry.bookings;
    if (userId) list = list.filter((b) => b.userId === userId);
    const total = list.reduce((acc, x) => acc + (Number(x.price) || 0), 0);
    list = list.slice().sort((a, b) => (a._dateStr > b._dateStr ? 1 : -1));
    return { bookings: list, total };
  };

  // PDF exporter (listado + total)
  const exportMonthPdf = ({ month, userFilter = null, filename = null }) => {
    const { bookings: list, total } = getMonthData({ month, userId: userFilter });
    const doc = new jsPDF();
    const title = userFilter
      ? `Facturación ${month} - Usuario ${userFilter}`
      : `Facturación ${month} - Todos los usuarios`;
    doc.setFontSize(14);
    doc.text(title, 14, 20);

    const tableBody = list.map((b) => [
      b._dateStr || "-",
      b.userName || b.userId || "-",
      b.type || "-",
      Number(b.price || 0).toFixed(2),
      b.notes || "",
    ]);

    doc.autoTable({
      startY: 28,
      head: [["Fecha", "Usuario", "Tipo", "Precio", "Notas"]],
      body: tableBody,
      styles: { fontSize: 10 },
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 28;
    doc.setFontSize(12);
    doc.text(`TOTAL: ${Number(total).toFixed(2)} €`, 14, finalY);

    const file = filename || `facturacion_${month}.pdf`;
    doc.save(file);
  };

  // último mes donde el usuario tiene reservas (modo user)
  const lastMonthForUser = useMemo(() => {
    if (mode !== "user") return null;
    return months.length > 0 ? months[0] : null;
  }, [months, mode]);

  return {
    bookings,
    users,
    loading,
    months,
    groupedByMonth,
    getMonthData,
    exportMonthPdf,
    lastMonthForUser,
  };
}
