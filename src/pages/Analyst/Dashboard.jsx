import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

function Dashboard() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const pieData = {
    labels: ["Low Risk", "Medium Risk", "High Risk"],
    datasets: [
      {
        data: [20, 15, 12],
        backgroundColor: ["#22C55E", "#F59E0B", "#EF4444"],
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Risks Over Time",
        data: [30, 25, 28, 22, 18],
        borderColor: theme === "dark" ? "#60A5FA" : "#1E90FF",
        fill: false,
      },
    ],
  };

  return (
    <div className={`dashboard ${theme}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
        </button>
      </div>

      <h1>Analyst Dashboard</h1>
      <p className="subtitle">Analyze risks, monitor compliance, and generate reports.</p>

      {/* === STATS CARDS === */}
      <div className="stats-grid">
        <div className="card">
          <h3>Total Risks</h3>
          <p className="value">47</p>
          <p className="trend down">↓ 12% from last month</p>
        </div>

        <div className="card">
          <h3>Critical Issues</h3>
          <p className="value">8</p>
        </div>

        <div className="card">
          <h3>Compliance Score</h3>
          <p className="value">92%</p>
          <p className="trend up">↑ 3% improvement</p>
        </div>

        <div className="card">
          <h3>Reports Generated</h3>
          <p className="value">24</p>
        </div>
      </div>

      {/* === RISK DISTRIBUTION === */}
      <div className="chart-card">
        <h2>Risk Distribution</h2>
        <div className="chart-area">
          <Pie data={pieData} />
        </div>
        <div className="toast">Login successful!</div>
      </div>

      {/* === COMPLIANCE CHECKLIST === */}
      <div className="checklist-card">
        <div className="header">
          <h2>Compliance Checklist</h2>
          <button className="view-btn">View Full Report</button>
        </div>
        <ul className="checklist">
          <li><span>Access Control</span><span className="status ok">Compliant</span></li>
          <li><span>Data Encryption</span><span className="status ok">Compliant</span></li>
          <li><span>Audit Logging</span><span className="status ok">Compliant</span></li>
          <li><span>Vulnerability Management</span><span className="status warn">Needs Attention</span></li>
          <li><span>Incident Response</span><span className="status ok">Compliant</span></li>
        </ul>
      </div>

      {/* === RISK OVER TIME === */}
      <div className="chart-card">
        <h2>Risk Over Time</h2>
        <div className="chart-area">
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
