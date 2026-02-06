 // ToolOwnerDashboard.jsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../css/ToolOwnerDashboard.css";

function ToolOwnerDashboard() {
  return (
    <div className="owner-dashboard-container">
      <header className="dashboard-sub-nav">
        <div className="tab-group">
          <NavLink to="" end className={({ isActive }) => isActive ? "tab active" : "tab"}>
            My Tools
          </NavLink>
          <NavLink to="create-tool" className={({ isActive }) => isActive ? "tab active" : "tab"}>
            Add New Tool
          </NavLink>
        </div>
      </header>

      <main className="dashboard-render-area">
        <Outlet />
      </main>
    </div>
  );
}

export default ToolOwnerDashboard;
