import React from 'react'
import { Link } from 'react-router-dom'
import "./Navbar.css"

function Navbar() {
  return (
       <nav className='nav-container'>
      {/* Logo */}
      <div>
        <Link to="/">
          <h2>AI-Mart</h2>
        </Link>
      </div>

      {/* Navigation Links */}
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar