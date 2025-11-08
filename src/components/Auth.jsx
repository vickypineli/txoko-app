// src/components/Auth.jsx
import { useState } from "react";
import {
  registerUser,
  loginUser,
  loginWithGoogle,
  logoutUser
} from "../services/authService";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const handleRegister = async () => {
    try {
      const newUser = await registerUser(email, password);
      setUser(newUser);
      alert("Usuario registrado correctamente");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const loggedUser = await loginUser(email, password);
      setUser(loggedUser);
      alert("Inicio de sesión exitoso");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const googleUser = await loginWithGoogle();
      setUser(googleUser);
      alert("Sesión iniciada con Google");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    alert("Sesión cerrada");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Autenticación del Txoko</h2>
      {!user ? (
        <>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br /><br />
          <button onClick={handleRegister}>Registrarse</button>
          <button onClick={handleLogin}>Iniciar sesión</button><br /><br />
          <button onClick={handleGoogleLogin}>Iniciar con Google</button>
        </>
      ) : (
        <>
          <p>Hola, {user.email}</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      )}
    </div>
  );
}

export default Auth;
