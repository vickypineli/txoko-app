// src/pages/RegisterPage.jsx
// src/pages/RegisterPage.jsx
import { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createUserProfile } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "../styles/pages/RegisterPage.scss";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    direccion: "",
    portal: "",
    piso: "",
    telefono: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // No guardar contraseña en Firestore
      
      // eslint-disable-next-line no-unused-vars
      const { password, ...profileData } = formData;
      await createUserProfile(userCredential.user.uid, profileData);

      alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/auth");
    } catch (err) {
      console.error("Error al registrarse:", err);
      alert("❌ No se pudo completar el registro. Verifica tus datos e inténtalo de nuevo.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Registro de Usuario</h2>
        <form onSubmit={handleRegister}>
          <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
          <input type="text" name="apellidos" placeholder="Apellidos" onChange={handleChange} required />
          <input type="text" name="direccion" placeholder="Dirección" onChange={handleChange} required />
          <input type="text" name="portal" placeholder="Portal" onChange={handleChange} />
          <input type="text" name="piso" placeholder="Piso" onChange={handleChange} />
          <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />

          <button type="submit">Registrarme</button>
        </form>

        <p>
          ¿Ya tienes cuenta?
          <span onClick={() => navigate("/auth")}> Inicia sesión</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

