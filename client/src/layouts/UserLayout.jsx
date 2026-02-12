import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./UserLayout.css";

function UserLayout() {
  const { user, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // 🎯 FOUNDER RULE: Click anywhere on profile to go to Dashboard/Settings
  const handleProfileNavigation = () => {
    if (role === "user") navigate("/settings");
    else if (role === "toolOwner") navigate("/toolowner/dashboard");
    else if (role === "founder") navigate("/founder/dashboard");
  };

  return (
    <div className="layout-wrapper">
      <nav className="global-navbar">
        <div className="nav-left">
          <h2 className="logo" onClick={() => navigate("/home")}>
            AI<span>Mart</span>
          </h2>
          <div className="nav-links">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="/saved" className="nav-saved-link">
              <span className="nav-heart">❤️</span> Saved
            </NavLink>
          </div>
        </div>

        <div className="nav-right">
          {user ? (
            <div 
              className="user-profile-trigger" 
              onClick={handleProfileNavigation}
              title="View Account"
            >
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
          ) : (
            <button className="btn-login" onClick={() => navigate("/login")}>Login</button>
          )}
        </div>
      </nav>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;  


