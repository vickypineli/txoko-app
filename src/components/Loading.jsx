// src/components/Loading.jsx
import React from "react";
import "../styles/components/Loading.scss";

export default function Loading({ text = "Cargando..." }) {
  return (
    <div className="loading-container">
      <div className="loading-dots">
        <div className="loading-dot" style={{ animationDelay: "0s" }} />
        <div className="loading-dot" style={{ animationDelay: "0.25s" }} />
        <div className="loading-dot" style={{ animationDelay: "0.5s" }} />
      </div>

      <span className="loading-text">{text}</span>
    </div>
  );
}

