import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./UserLayout.css";

function UserLayout() {
  const { user, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Navigation Logic for Settings
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
            {/* Direct access to Saved Tools */}
            <NavLink to="/saved" className="nav-saved-link">
              <span className="nav-heart">❤️</span> Saved
            </NavLink>
          </div>
        </div>

        <div className="nav-right">
          {user ? (
            <div 
              className="user-profile-section" 
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="profile-trigger">
                <div className="user-info">
                  <span className="user-name">{user.name || "Account"}</span>
                  <span className="user-role-badge">{role}</span>
                </div>
                <div className="nav-avatar">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="User" />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
              </div>

              {/* 💧 DROPDOWN MENU */}
              {isDropdownOpen && (
                <div className="nav-dropdown">
                  <div className="dropdown-item" onClick={() => { navigate("/saved"); setIsDropdownOpen(false); }}>
                    <i className="icon">📂</i> My Saved
                  </div>
                  
                  <div className="dropdown-item" onClick={handleProfileClick}>
                    <i className="settings-icon">⚙️</i> Settings
                  </div>

                  {role === "toolOwner" && (
                    <div className="dropdown-item" onClick={() => { navigate("/toolowner/dashboard"); setIsDropdownOpen(false); }}>
                      <i className="dash-icon">📊</i> Dashboard
                    </div>
                  )}

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


