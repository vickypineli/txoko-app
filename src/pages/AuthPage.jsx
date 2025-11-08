import { useState } from "react";
import { auth, googleProvider } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/pages/AuthPage.scss";

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>{isRegister ? "Registro" : "Iniciar Sesión"}</h2>

        <form onSubmit={handleSubmit}>
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

          <button type="submit">
            {isRegister ? "Registrarme" : "Entrar"}
          </button>
        </form>

        <button className="google-btn" onClick={handleGoogle}>
          Iniciar sesión con Google
        </button>

        <p>
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? " Inicia sesión" : " Regístrate"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
