 import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./UserLayout.css"; // optional styling

function UserLayout() {
  const { user, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Role-based dashboard path
  const getDashboardLink = () => {
    if (role === "user") return "/user/dashboard";
    if (role === "toolOwner") return "/toolowner/dashboard";
    if (role === "founder") return "/founder/dashboard";
    return "/";
  };

  return (
    <>
      {/* 🌍 GLOBAL NAVBAR */}
      <nav className="global-navbar">
        <h2 className="logo" onClick={() => navigate("/home")}>
          AI Mart
        </h2>

        <div className="nav-links">
          <NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>
            Home
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => isActive ? "active" : ""}>
            Explore
          </NavLink>

          {user && (
            <NavLink to={getDashboardLink()} className={({ isActive }) => isActive ? "active" : ""}>
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="nav-right">
          {user ? (
            <span>{role} {/* future: add dropdown for profile/logout */}</span>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </div>
      </nav>

      {/* Page content */}
      <Outlet />
    </>
  );
}

export default UserLayout;


