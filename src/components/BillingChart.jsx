// src/components/BillingChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";
import "../styles/components/BillingChart.scss";

/**
 * data = [
 *   { month: "2025-01", label: "Enero 2025", total: 240 },
 *   { month: "2025-02", label: "Febrero 2025", total: 340 },
 * ]
 */
export default function BillingChart({ data }) {
  if (!data || data.length === 0) {
    return <p>No hay datos para mostrar en el gráfico.</p>;
  }

  return (
    <div className="billing-chart-container" style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{  top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
                    {/* ★ Cambia aquí el color de las barras */}
          <Bar
            dataKey="total"
            name="Total €"
            fill="#D2691E"
            stroke="#D2691E"   // borde azul más oscuro
            strokeWidth={1}
            radius={[6, 6, 0, 0]} // esquinas redondeadas
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
