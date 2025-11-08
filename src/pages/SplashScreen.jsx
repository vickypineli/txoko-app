import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/SplashScreen.scss";

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth"); // Ir a login tras 3s
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen">
      <h1 className="logo">Txoko App</h1>
      <p>Organiza y reserva tu espacio comunitario</p>
    </div>
  );
}

export default SplashScreen;
