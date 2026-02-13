import React, { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import "./ToolOwnerLayout.css"
function ToolOwnerLayout() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="toolowner-container">
      {/* 🍔 Mobile Toggle Button */}
      <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* 🛠️ SIDEBAR */}
      <aside className={`owner-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-logo" onClick={() => { navigate("/home"); setIsMobileMenuOpen(false); }}>
          AI<span>Mart</span>
          <small>Creator</small>
        </div>

        <div className="sidebar-links">
          <p className="menu-label">Main Menu</p>
          <NavLink to="/toolowner/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>
             <span className="icon">📊</span> Dashboard
          </NavLink>
          <NavLink to="/home" onClick={() => setIsMobileMenuOpen(false)}>
             <span className="icon">🌐</span> View Site
          </NavLink>
          <NavLink to="/explore" onClick={() => setIsMobileMenuOpen(false)}>
             <span className="icon">🔎</span> Explore Tools
          </NavLink>

          <p className="menu-label">Configuration</p>
          <NavLink to="/toolowner/settings" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "active-link" : ""}>
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
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </div>
  );
}

export default ToolOwnerLayout; 