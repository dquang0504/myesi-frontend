import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import sidebarMenus from "../config/sidebarMenu"; // centralized menu config

function Sidebar() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // === 1️⃣ Load user role from localStorage or infer from route ===
  useEffect(() => {
    let storedRole = localStorage.getItem("userRole");

    if (!storedRole) {
      if (location.pathname.startsWith("/admin")) storedRole = "admin";
      else if (location.pathname.startsWith("/analyst")) storedRole = "analyst";
      else if (location.pathname.startsWith("/developer")) storedRole = "developer";
      else if (location.pathname.startsWith("/auditor")) storedRole = "auditor";
    }

    if (storedRole) setRole(storedRole.toLowerCase());
  }, [location]);

  // === 2️⃣ Fetch role-based menu ===
  const currentMenu = sidebarMenus[role] || [];

  // === 3️⃣ Logout Handler ===
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar h-full flex flex-col justify-between">
      {/* === Logo Section === */}
      <div>
        <div className="logo">
          <h2>MyESI</h2>
          <p>Security Platform</p>
        </div>

        {/* === Dynamic Nav Menu === */}
        <nav className="nav-menu mt-6">
          {currentMenu.length > 0 ? (
            currentMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                {item.name}
              </NavLink>
            ))
          ) : (
            <p className="text-sm text-gray-400 ml-2">No menu available</p>
          )}
        </nav>
      </div>

      {/* === User Section === */}
      <div className="user-section">
        <div className="user-info">
          <div className="avatar">
            {role ? role[0].toUpperCase() : "?"}
          </div>
          <div>
            <p className="username capitalize">{role || "User"}</p>
            <p className="role capitalize">{role || "Role"}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
