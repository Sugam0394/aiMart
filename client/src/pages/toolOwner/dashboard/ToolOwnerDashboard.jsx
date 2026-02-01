 import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../css/ToolOwnerDashboard.css";

function ToolOwnerDashboard() {
  return (
    <div className="toolowner-dashboard">

      {/* 🧱 SIDEBAR */}
      <aside className="dashboard-sidebar">
        <NavLink to="" end>
          My Tools
        </NavLink>

        <NavLink to="create-tool">
          Create Tool
        </NavLink>
      </aside>

      {/* 📦 CONTENT */}
      <main className="dashboard-content">
        <Outlet />
      </main>

    </div>
  );
}

export default ToolOwnerDashboard;
