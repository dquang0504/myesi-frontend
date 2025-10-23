import React, { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setRole(storedRole.toLowerCase());
  }, []);

  // Role-based quick actions
  const roleActions = {
    admin: (
      <>
        <button className="action-btn">Manage Users</button>
        <button className="action-btn">System Logs</button>
      </>
    ),
    analyst: (
      <>
        <button className="action-btn">Download Report</button>
        <button className="action-btn">View Trends</button>
      </>
    ),
    developer: (
      <>
        <button className="action-btn">Update SBOM</button>
        <button className="action-btn">View Issues</button>
      </>
    ),
    auditor: (
      <>
        <button className="action-btn">Generate Audit</button>
        <button className="action-btn">Compliance Check</button>
      </>
    ),
  };

  return (
    <div className="topbar">
      {/* === Left Section: Greeting + Search === */}
      <div className="left-section">
        <h3 className="greeting">
          {role
            ? `Welcome back, ${role.charAt(0).toUpperCase() + role.slice(1)}!`
            : "Welcome to MyESI"}
        </h3>
      </div>

      {/* === Middle Section: Search Bar === */}
      <input
        type="text"
        placeholder="Search projects, reports..."
        className="search-input"
      />

      {/* === Right Section: Role Actions + Icons === */}
      <div className="right-section">
        {role && roleActions[role]}
        <span className="icon">🔔</span>
        <span className="icon">⚙️</span>
      </div>
    </div>
  );
}

export default Navbar;
