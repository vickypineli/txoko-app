// src/pages/AuthPage.jsx
import { useState } from "react";
import { auth} from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/pages/AuthPage.scss";

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Error al iniciar sesión. Verifica tus datos o regístrate primero.");
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     await signInWithPopup(auth, googleProvider);
  //     navigate("/home");
  //   } catch (err) {
  //     alert("Error con Google Sign-In: " + err.message);
  //   }
  // };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>

        {/* <button className="google-btn" onClick={handleGoogleLogin}>
          Iniciar sesión con Google
        </button> */}

        <p className="register-text">
          ¿No tienes cuenta?
          <span onClick={() => navigate("/register")}> Regístrate aquí</span>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;

