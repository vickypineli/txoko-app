// src/components/Modal.jsx
import { useEffect, useState } from "react";
import "../styles/components/Modal.scss";

function Modal({ isOpen, onClose, children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setVisible(true);
    else {
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "fade-in" : "fade-out"}`} onClick={onClose}>
      <div
        className={`modal-content ${isOpen ? "slide-in" : "slide-out"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
