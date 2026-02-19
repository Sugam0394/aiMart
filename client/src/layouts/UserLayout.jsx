import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./UserLayout.css";

function UserLayout() {
  const { user, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleProfileNavigation = (e) => {
    e.preventDefault();
    e.stopPropagation(); 

    // FIX: Redux ke 'role' ke saath user object ke role ko bhi check karte hain
    // Isse session restore (1-2 hours baad) wala bug theek ho jayega
    const currentRole = user?.role || role;

    if (!currentRole) {
      navigate("/login");
      return;
    }

    // Role-based navigation logic
    if (currentRole === "user") {
      navigate("/settings");
    } else if (currentRole === "toolOwner") {
      navigate("/toolowner/dashboard");
    } else if (currentRole === "founder") {
      navigate("/founder/dashboard");
    }
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
              onTouchStart={(e) => e.stopPropagation()} 
              title="View Account"
            >
              <div className="user-info">
                <span className="user-name">{user.name || "Account"}</span>
                {/* Yahan bhi fallback role lagaya hai display ke liye */}
                <span className="user-role-badge">{user.role || role}</span>
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


