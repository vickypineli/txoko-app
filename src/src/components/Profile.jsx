// src/components/Profile.jsx
import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from "../services/userService";

function Profile() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    direccion: "",
    portal: "",
    piso: "",
    telefono: "",
    email: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setFormData((prev) => ({ ...prev, email: user.email }));
      loadProfile(user.uid);
    }
  }, []);

  const loadProfile = async (uid) => {
    const profile = await getUserProfile(uid);
    if (profile) {
      setFormData(profile);
    }
    setIsLoaded(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Debes iniciar sesión");

    await createUserProfile(user.uid, formData);
    alert("Perfil guardado correctamente ✅");
  };

  const handleUpdate = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Debes iniciar sesión");

    await updateUserProfile(user.uid, formData);
    alert("Perfil actualizado correctamente 🔄");
  };

  if (!isLoaded) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Perfil de usuario</h2>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
      /><br />
      <input
        type="text"
        name="apellidos"
        placeholder="Apellidos"
        value={formData.apellidos}
        onChange={handleChange}
      /><br />
      <input
        type="text"
        name="direccion"
        placeholder="Dirección"
        value={formData.direccion}
        onChange={handleChange}
      /><br />
      <input
        type="text"
        name="portal"
        placeholder="Portal"
        value={formData.portal}
        onChange={handleChange}
      /><br />
      <input
        type="text"
        name="piso"
        placeholder="Piso"
        value={formData.piso}
        onChange={handleChange}
      /><br />
      <input
        type="text"
        name="telefono"
        placeholder="Teléfono"
        value={formData.telefono}
        onChange={handleChange}
      /><br />
      <input type="email" value={formData.email} disabled /><br /><br />

      <button onClick={handleSave}>Guardar Perfil</button>
      <button onClick={handleUpdate}>Actualizar Perfil</button>
    </div>
  );
}

export default Profile;
