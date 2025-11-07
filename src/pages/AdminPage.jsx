// src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./../styles/AdminPage.scss";

function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const q = query(collection(db, "bookings"), orderBy("fecha", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(data);
      } catch (error) {
        console.error("Error al obtener las reservas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="admin-loading">Cargando reservas...</p>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Panel de Administración del Txoko</h1>

      {bookings.length === 0 ? (
        <p className="no-bookings">No hay reservas registradas.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.uid}</td>
                <td>{new Date(b.fecha.seconds * 1000).toLocaleDateString()}</td>
                <td>{b.tipo}</td>
                <td>{b.precio} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default AdminPage;