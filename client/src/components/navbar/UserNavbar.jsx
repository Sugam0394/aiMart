import React from "react";
import { Link } from "react-router-dom";
import "./UserNavbar.css"
import Logout from "../LogoutButton/Logout";

function UserNavbar() {
 

  return (
   <nav className="user-navbar">
      <div className="nav-left"><h2>AI-Mart</h2></div>
      <ul className="nav-center">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/explore">Explore</Link></li>
        <li><Link to="/saved">Saved</Link></li>
      </ul>

      {/* ✅ FIX: Ab logout hamesha visible rahega, Settings ke andar hide nahi hoga */}
      <div className="nav-right">
        <Logout />
      </div>
    </nav>
  );
}

export default UserNavbar;