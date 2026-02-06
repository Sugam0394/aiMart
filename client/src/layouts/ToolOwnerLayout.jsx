 import React from 'react';
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import './ToolOwnerLayout.css';

function ToolOwnerLayout() {
  const navigate = useNavigate();

  return (
    <div className="toolowner-container">
      {/* 🛠️ SIDEBAR - The Command Center */}
      <aside className="owner-sidebar">
        <div className="sidebar-logo" onClick={() => navigate("/home")}>
          AI<span>Mart</span>
          <small>Creator</small>
        </div>

        <div className="sidebar-links">
          <p className="menu-label">Main Menu</p>
          <NavLink to="/toolowner/dashboard" className={({ isActive }) => isActive ? "active-link" : ""}>
             <span className="icon">📊</span> Dashboard
          </NavLink>
          <NavLink to="/home" className={({ isActive }) => isActive ? "active-link" : ""}>
             <span className="icon">🌐</span> View Site
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => isActive ? "active-link" : ""}>
             <span className="icon">🔎</span> Explore Tools
          </NavLink>

          <p className="menu-label">Configuration</p>
          <NavLink to="/toolowner/settings" className={({ isActive }) => isActive ? "active-link" : ""}>
             <span className="icon">⚙️</span> Settings
          </NavLink>
        </div>

        <div className="sidebar-footer">
          <div className="owner-mini-card">
            <div className="dot active-dot"></div>
            <span>Tool Owner Mode</span>
          </div>
        </div>
      </aside>

      {/* 📦 MAIN CONTENT AREA */}
      <div className="owner-content-wrapper">
        <header className="owner-top-bar">
          <div className="top-bar-left">
            <h3>Management Console</h3>
          </div>
          <div className="top-bar-right">
            <span className="owner-badge">Partner</span>
          </div>
        </header>

        <main className="owner-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ToolOwnerLayout;