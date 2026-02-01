import React from "react";
import { Link } from "react-router-dom";
import "./AuthNavbar.css"; // optional styling

function AuthNavbar() {
  return (
    <nav className="auth-navbar">
      {/* Logo */}
      <div className="logo">
      
          <h2>AI-Mart</h2>
        
      </div>

      {/* Navigation Links */}

      <ul className="nav-links">
         <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </nav>
  );
}

export default AuthNavbar;
