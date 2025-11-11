// src/utils/format.js

/**
 * Devuelve las iniciales del nombre y apellidos.
 */
export const getInitials = (nombre = "", apellidos = "") => {
  const n = nombre.trim().split(" ")[0] || "";
  const a = apellidos.trim().split(" ")[0] || "";
  return (n.charAt(0) + (a.charAt(0) || "")).toUpperCase();
};

/**
 * Formatea una fecha YYYY-MM-DD → DD-MM-YYYY
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};
