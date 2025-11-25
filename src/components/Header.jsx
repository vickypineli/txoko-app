//src/components/Header.jsx

import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

import { Utensils } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/components/Header.scss";

function Header() {
  const navigate = useNavigate();
  const { user, profile, isAdmin } = useAuth();

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };
  
  return (
      <header className="header">
        <div className="logo-box">
          <Utensils className="logo-svg" size={60} aria-hidden="true" />
          <h1 className="home-title">Txoko-App</h1>
        </div>

        {user && profile && (
          <div className="user-header">
            <p className="user-name" onClick={() => navigate("/profile")}>
              Hola, {profile.nombre} {profile.apellidos}
            </p>

            <div className="user-actions">
               <button 
                  onClick={() => navigate("/home")}
                  className="btn-small back">
                  Inicio
               </button>

              {isAdmin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="btn-small admin"
                >
                  Admin
                </button>

              )}
              {!isAdmin && (
                <button
                  onClick={() => navigate("/profile")}
                  className="btn-small profile"
                >
                  Mi Perfil
                </button>
              )}

              <button onClick={handleLogout} className="btn-small logout">
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </header>
    );
  }
  
  export default Header;