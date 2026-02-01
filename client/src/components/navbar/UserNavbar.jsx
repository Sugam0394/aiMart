import React from "react";
import { Link } from "react-router-dom";
import "./UserNavbar.css"

function UserNavbar() {
 

  return (
   <nav className="user-navbar">
      {/* 🔰 Logo */}
      <div className="nav-left">
        <h2>AI-Mart</h2>
      </div>

     <ul className="nav-center">
  <li>
    <Link to="/home">Home</Link>   {/* ✅ fixed */}
  </li>
  <li>
    <Link to="/explore">Explore</Link>
  </li>
  <li>
    <Link to="/user/dashboard">Dashboard</Link>
  </li>
</ul>

    </nav>
  );
}

export default UserNavbar;