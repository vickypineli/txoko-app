// src/components/Loading.jsx
export default function Loading({ text = "Cargando..." }) {
  return (
    <div style={{
      display: "flex",
      gap: "8px",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontSize: "15px"
    }}>
      <div
        style={{
          width: "16px",
          height: "16px",
          border: "3px solid #ccc",
          borderTopColor: "#6a4df4",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <span>{text}</span>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
