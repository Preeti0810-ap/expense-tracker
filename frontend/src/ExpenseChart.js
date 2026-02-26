import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

function ExpenseChart({ expenses }) {

  const grouped = {};

  expenses.forEach(e => {
    grouped[e.category] = (grouped[e.category] || 0) + Number(e.amount);
  });

  const data = {
    labels: Object.keys(grouped),
    datasets: [{
      data: Object.values(grouped),
      backgroundColor: [
        "#22c55e","#3b82f6","#f59e0b","#ef4444",
        "#a855f7","#06b6d4","#84cc16"
      ]
    }]
  };

  return (
    <div style={{ width:350 }}>
      <Pie data={data}/>
    </div>
  );
}

export default ExpenseChart;