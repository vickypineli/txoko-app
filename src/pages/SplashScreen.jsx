// src/pages/SplashScreen.jsx
import { Utensils } from "lucide-react";
import "../styles/pages/SplashScreen.scss";

function SplashScreen() {
  return (
    <div className="splash-screen" role="img" aria-label="Splash Txoko App">
      <div className="logo-box">
        <div className="logo-svg">
        {/* Icono de tenedor y cuchillo */}
        <Utensils className="logo-svg" size={90} aria-hidden="true" />
        </div>

        <h1 className="logo-text">Txoko-App</h1>
        <p className="subtitle">Tu gestor de reservas para txokos.</p>
        <p className="subtitle">Organiza y reserva tu espacio comunitario</p>
        {/* <div className="loader" aria-hidden="true"></div> */}
      </div>
    </div>
  );
}

export default SplashScreen;

