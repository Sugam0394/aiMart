import React from 'react'
import { Link } from 'react-router-dom'
import "./Navbar.css"

function Navbar() {
  return (
    <nav className='nav-container'>
      {/* Logo Wrapper */}
      <div className="nav-logo-wrapper">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 className="nav-logo-text">AI-Mart</h2>
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li>
          <Link to="/login" style={{ textDecoration: 'none' }}>Login</Link>
        </li>
        <li>
          <Link to="/register" style={{ textDecoration: 'none' }} className="register-btn">
            Register
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar 