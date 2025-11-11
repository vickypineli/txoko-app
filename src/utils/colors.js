// src/utils/colors.js

/**
 * Genera un color HSL único basado en un string (uid o nombre)
 */
export const getAvatarColor = (str = "default") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};
