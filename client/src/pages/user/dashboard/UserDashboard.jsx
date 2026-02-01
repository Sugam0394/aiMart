 import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import ApplyToolOwner from "../../toolOwner/dashboard/ApplyToolOwner";
import "../css/UserDashboard.css";

function UserDashboard() {
  return (
    <div className="user-dashboard">

      {/* 🧱 SIDEBAR */}
      <aside className="dashboard-sidebar">
        <NavLink
          to="/settings"
          className={({ isActive }) => isActive ? "active" : ""}
        >
          Settings
        </NavLink>
      </aside>

      {/* 📦 MAIN CONTENT */}
      <main className="dashboard-main">
        <h2>Welcome to your Dashboard!</h2>

        <div className="apply-card">
          <ApplyToolOwner />
        </div>

        {/* Nested route rendering (Settings page) */}
        <Outlet />
      </main>
    </div>
  );
}

export default UserDashboard;
