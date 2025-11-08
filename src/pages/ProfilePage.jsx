import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "../styles/pages/ProfilePage.scss";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    nombre: "",
    apellidos: "",
    direccion: "",
    portal: "",
    piso: "",
    telefono: "",
    email: "",
  });
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(false);

  // Obtener usuario autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadUserProfile(currentUser.uid);
        await loadUserBookings(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserProfile = async (uid) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      setProfile(snap.data());
    }
  };

  const loadUserBookings = async (uid) => {
    const q = query(collection(db, "bookings"), where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setBookings(data);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, profile);
    setEditing(false);
    alert("✅ Perfil actualizado correctamente");
  };

  return (
    <div className="profile-page">
      <h2>Mi Perfil</h2>

      <div className="profile-card">
        {editing ? (
          <div className="profile-form">
            <label>Nombre:</label>
            <input type="text" name="nombre" value={profile.nombre} onChange={handleChange} />

            <label>Apellidos:</label>
            <input type="text" name="apellidos" value={profile.apellidos} onChange={handleChange} />

            <label>Dirección:</label>
            <input type="text" name="direccion" value={profile.direccion} onChange={handleChange} />

            <label>Portal:</label>
            <input type="text" name="portal" value={profile.portal} onChange={handleChange} />

            <label>Piso:</label>
            <input type="text" name="piso" value={profile.piso} onChange={handleChange} />

            <label>Teléfono:</label>
            <input type="text" name="telefono" value={profile.telefono} onChange={handleChange} />

            <button onClick={handleSave}>Guardar</button>
          </div>
        ) : (
          <div className="profile-info">
            <p><strong>Nombre:</strong> {profile.nombre}</p>
            <p><strong>Apellidos:</strong> {profile.apellidos}</p>
            <p><strong>Dirección:</strong> {profile.direccion}</p>
            <p><strong>Portal:</strong> {profile.portal}</p>
            <p><strong>Piso:</strong> {profile.piso}</p>
            <p><strong>Teléfono:</strong> {profile.telefono}</p>
            <p><strong>Email:</strong> {user?.email}</p>

            <button onClick={() => setEditing(true)}>Editar</button>
          </div>
        )}
      </div>

      <h3>Historial de Reservas</h3>
      {bookings.length === 0 ? (
        <p>No has realizado ninguna reserva todavía.</p>
      ) : (
        <ul className="booking-list">
          {bookings.map((b) => (
            <li key={b.id}>
              <strong>{b.date}</strong> — {b.type} — {b.price}€
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProfilePage;
