import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

function FounderLayout() {
  const navigate = useNavigate();

  return (
    <div className="founder-layout">
      {/* 🔝 Top Navbar */}
      <nav className="top-navbar">
        <h2 className="logo" onClick={() => navigate("/home")}>
          AI Bridge
        </h2>

        <div className="nav-links">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/founder/dashboard">Dashboard</NavLink>
          <NavLink to="/founder/settings">Settings</NavLink>
        </div>

        <div className="nav-right">
          Founder
        </div>
      </nav>

      {/* Page content */}
      <Outlet />
    </div>
  );
}

export default FounderLayout;
