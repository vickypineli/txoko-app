// src/pages/SplashScreen.jsx
import "../styles/pages/SplashScreen.scss";

function SplashScreen() {
  return (
    <div className="splash-screen" role="img" aria-label="Splash Txoko App">
      <div className="logo-box">
        {/* Logo SVG — cazuela estilizada */}
        <div className="logo-svg" aria-hidden="true">
          <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(2,2)">
              {/* Cuerpo de la cazuela */}
              <path d="M6 30 C6 20, 54 20, 54 30 C54 36, 50 40, 32 40 C14 40, 10 36, 6 30 Z"
                fill="#fff" opacity="0.95"/>
              {/* Tapa */}
              <ellipse cx="30" cy="20" rx="22" ry="6" fill="#fff" />
              {/* Mango izquierdo */}
              <rect x="0" y="26" width="6" height="3" rx="1" fill="#fff" />
              {/* Mango derecho */}
              <rect x="52" y="26" width="6" height="3" rx="1" fill="#fff" />
              {/* Detalle interior (sombra) */}
              <path d="M10 30 C16 26, 44 26, 54 30" stroke="#e6e6e6" strokeWidth="1.5" fill="none" />
              {/* Outline (color principal a usar por CSS) */}
              <path d="M6 30 C6 20, 54 20, 54 30 C54 36, 50 40, 32 40 C14 40, 10 36, 6 30 Z"
                stroke="currentColor" strokeWidth="2" fill="none"/>
            </g>
          </svg>
        </div>

        <h1 className="logo-text">Txoko-App</h1>
        <p className="subtitle">Organiza y reserva tu espacio comunitario</p>

        <div className="loader" aria-hidden="true"></div>
      </div>
    </div>
  );
}

export default SplashScreen;

