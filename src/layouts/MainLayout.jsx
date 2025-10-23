import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/layout.css"; // ensure the CSS file exists

export default function MainLayout({ children }) {
  return (
    <div className="main-layout-root">
      {/* Sidebar container */}
      <aside className="sidebar-container">
        <Sidebar />
      </aside>

      {/* Content (navbar + page) */}
      <div className="content-container">
        <header className="navbar-container">
          <Navbar />
        </header>

        <main className="page-container">{children}</main>
      </div>
    </div>
  );
}
