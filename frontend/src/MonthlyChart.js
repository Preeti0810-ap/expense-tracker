import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale);

function MonthlyChart({ expenses }) {

  const months = Array(12).fill(0);

  expenses.forEach(e=>{
    const m = new Date(e.transaction_date).getMonth();
    months[m] += Number(e.amount);
  });

  const data = {
    labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets:[{
      data:months,
      backgroundColor:"#3b82f6"
    }]
  };

  return(
    <div style={{ width:400 }}>
      <Bar data={data}/>
    </div>
  )
}

export default MonthlyChart;