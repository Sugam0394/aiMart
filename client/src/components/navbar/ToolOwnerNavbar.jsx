import React from "react";
import { Link } from "react-router-dom";
import "./ToolOwnerNavbar.css";

function ToolOwnerNavbar() {
  return (
    <nav className="toolowner-navbar">
      {/* 🔰 Logo */}
      <div className="nav-left">
          <h2>AI-Mart</h2>
      </div>

      {/* 🔗 Links */}
      <ul className="nav-center">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/explore">Explore</Link>
        </li>
      </ul>
    </nav>
  );
}

export default ToolOwnerNavbar;
