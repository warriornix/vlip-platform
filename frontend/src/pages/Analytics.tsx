import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import api from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const [mileageData, setMileageData] = useState([12000, 15000, 18000, 20000]);
  const [maintenanceData, setMaintenanceData] = useState([2, 3, 1, 4]);
  const [subscription, setSubscription] = useState(null);

  const mileageChart = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Mileage (km)",
        data: mileageData,
        borderColor: "#a64ca6",
        backgroundColor: "rgba(166,76,166,0.3)"
      }
    ]
  };

  const maintenanceChart = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Maintenance Logs",
        data: maintenanceData,
        backgroundColor: "#a64ca6"
      }
    ]
  };

  return (
    <div style={{ padding: "20px", color: "#eee" }}>
      <h1 style={{ color: "#a64ca6" }}>Analytics Dashboard</h1>
      <div style={{ marginTop: "20px" }}>
        <h2 style={{ color: "#a64ca6" }}>Mileage Trends</h2>
        <Line data={mileageChart} />
      </div>
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ color: "#a64ca6" }}>Maintenance Frequency</h2>
        <Bar data={maintenanceChart} />
      </div>
    </div>
  );
}

export default Analytics;
