import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./FounderLayout.css"; // Nayi CSS file banayein

function FounderLayout() {
  const navigate = useNavigate();

  return (
    <div className="founder-wrapper">
      {/* 🔝 Top Navbar */}
      <nav className="founder-navbar">
        <div className="nav-container">
          <h2 className="brand-logo" onClick={() => navigate("/home")}>
            AI <span>Mart</span>
          </h2>

          <div className="nav-menu">
            <NavLink to="/home" className={({ isActive }) => (isActive ? "active-link" : "")}>Home</NavLink>
            <NavLink to="/explore" className={({ isActive }) => (isActive ? "active-link" : "")}>Explore</NavLink>
            <NavLink to="/founder/dashboard" className={({ isActive }) => (isActive ? "active-link" : "")}>Dashboard</NavLink>
            <NavLink to="/founder/settings" className={({ isActive }) => (isActive ? "active-link" : "")}>Settings</NavLink>
          </div>

          <div className="founder-profile">
            <div className="status-indicator"></div>
            <span>Founder</span>
          </div>
        </div>
      </nav>

      {/* Page content wrapper */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default FounderLayout; 
