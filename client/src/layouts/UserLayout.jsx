 import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // useDispatch add kiya
import { resetExplore } from "../app/exploreFeatures/exploreSlice";
import { startExploreThunk } from "../app/exploreFeatures/exploreThunks";
import "./UserLayout.css";

function UserLayout() {
  const { user, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Dispatcher initialize kiya

   
  const handleExploreClick = (e) => {
    e.preventDefault();  
    
    dispatch(resetExplore());  
    dispatch(startExploreThunk());  
    
    navigate("/explore");  
  };

  const handleProfileNavigation = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    const currentRole = user?.role || role;
    if (!currentRole) {
      navigate("/login");
      return;
    }
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
            
            {/* 🛠️ Explore Link ko function se replace kiya */}
            <a 
              href="/explore" 
              className={({ isActive }) => isActive ? "active" : ""} 
              onClick={handleExploreClick}
            >
              Explore
            </a>

            <NavLink to="/saved" className="nav-saved-link">
              <span className="nav-heart"></span> Saved
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


