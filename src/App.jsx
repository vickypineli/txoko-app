// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Páginas
import SplashScreen from "./pages/SplashScreen";
import AuthPage from "./pages/AuthPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Profile from "./pages/ProfilePage";

// Estilos globales
import "./styles/main.scss";

function App() {
  const [loading, setLoading] = useState(true); // controla el splash inicial
  const [user, setUser] = useState(null);       // estado del usuario autenticado

  // Detectar autenticación tras mostrar el splash
  useEffect(() => {
    const timer = setTimeout(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false); // deja de mostrar el splash
      });
      return () => unsubscribe();
    }, 2500); // duración splash
    return () => clearTimeout(timer);
  }, []);

  // Mientras está cargando, mostrar pantalla de inicio
  if (loading) {
    return <SplashScreen />;
  }

  //Rutas principales
  return (
    <Router>
      <Routes>
        {/* Si está logueado → home, si no → login */}
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Navigate to="/auth" />}
        />

        {/* Login */}
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/home" />}
        />

        {/* Registro */}
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/home" />}
        />

        {/* Página principal */}
        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />

        {/* Perfil */}
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/auth" />}
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;




