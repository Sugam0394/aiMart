 import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./UserLayout.css"; 

function UserLayout() {
  const { user, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Navigatation Logic
  const handleProfileClick = () => {
    if (role === "user") navigate("/settings");
    else if (role === "toolOwner") navigate("/toolowner/settings");
    else if (role === "founder") navigate("/founder/settings");
    setIsDropdownOpen(false);
  };

  return (
    <div className="layout-wrapper">
      {/* 🌍 MODERN NAVBAR */}
      <nav className="global-navbar">
        <div className="nav-left">
          <h2 className="logo" onClick={() => navigate("/home")}>
            AI<span>Mart</span>
          </h2>
          <div className="nav-links">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/explore">Explore</NavLink>
          </div>
        </div>

        <div className="nav-right">
          {user ? (
            <div className="user-profile-section" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <div className="profile-trigger">
                <div className="user-info">
                  <span className="user-name">{user.name || "Account"}</span>
                  <span className="user-role-badge">{role}</span>
                </div>
                <div className="nav-avatar">
                   {user.profilePicture ? (
                     <img src={user.profilePicture} alt="User" />
                   ) : (
                     user.name?.charAt(0) || "U"
                   )}
                </div>
              </div>

              {/* 💧 DROPDOWN MENU */}
              {isDropdownOpen && (
                <div className="nav-dropdown">
                  <div className="dropdown-item" onClick={handleProfileClick}>
                    <i className="settings-icon">⚙️</i> Settings
                  </div>
                  {role === "toolOwner" && (
                    <div className="dropdown-item" onClick={() => navigate("/toolowner/dashboard")}>
                      <i className="dash-icon">📊</i> Dashboard
                    </div>
                  )}
                  <div className="dropdown-divider"></div>
                  {/* Logout logic yahan bhi handle kar sakte ho */}
                </div>
              )}
            </div>
          ) : (
            <button className="btn-login" onClick={() => navigate("/login")}>Login</button>
          )}
        </div>
      </nav>

      {/* Page content with spacing for fixed navbar */}
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;


