// src/App.jsx
import { useState } from "react";
import Auth from "./src/components/Auth";
import Profile from "./src/components/Profile";
import BookingForm from "./src/components/BookingForm";
import './styles/main.scss';


function App() {
  const [view, setView] = useState("auth");

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setView("auth")}>Login</button>
        <button onClick={() => setView("profile")}>Perfil</button>
        <button onClick={() => setView("booking")}>Reservar Txoko</button>
      </div>
      <hr />
      {view === "auth" && <Auth />}
      {view === "profile" && <Profile />}
      {view === "booking" && <BookingForm />}
    </div>
  );
}

export default App;




