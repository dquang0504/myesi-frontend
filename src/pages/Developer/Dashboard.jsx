import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { mockLogout } from "../../services/mockAuthService";
import { useAuth } from "../../context/AuthContext";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function DeveloperDashboard() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const {logout} = useAuth();

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // === Dummy Data for Projects ===
  const projects = [
    { name: "Payment API", vulnerabilities: 12, status: "In Progress", updated: "2025-10-18" },
    { name: "Auth Service", vulnerabilities: 5, status: "Completed", updated: "2025-10-16" },
    { name: "Frontend UI", vulnerabilities: 8, status: "In Progress", updated: "2025-10-15" },
    { name: "Database Layer", vulnerabilities: 4, status: "Pending", updated: "2025-10-12" },
  ];

  // === Chart Data (Progress of Fixes) ===
  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Fix Progress",
        data: [10, 25, 45, 65],
        borderColor: theme === "dark" ? "#60A5FA" : "#1E90FF",
        fill: false,
      },
    ],
  };

  return (
      <div className={`dashboard ${theme}`}>
        {/* === Theme Toggle === */}
        <div className="theme-toggle">
          <button onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
          </button>
          <button onClick={logout}>Log out</button>
        </div>

        <h1>Developer Dashboard</h1>
        <p className="subtitle">View your assigned projects and track fix progress.</p>

        {/* === PROJECT TABLE === */}
        <div className="chart-card">
          <h2>Assigned Projects</h2>
          <table className="project-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Vulnerabilities</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, index) => (
                <tr key={index}>
                  <td>{p.name}</td>
                  <td>{p.vulnerabilities}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        p.status === "Completed"
                          ? "ok"
                          : p.status === "Pending"
                          ? "warn"
                          : "progress"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>{p.updated}</td>
                  <td>
                    <button className="update-btn">Update SBOM</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* === FIX PROGRESS CHART === */}
        <div className="chart-card">
          <h2>Fix Progress Over Time</h2>
          <div className="chart-area">
            <Line data={lineData} />
          </div>
        </div>
      </div>
  );
}

export default DeveloperDashboard;
