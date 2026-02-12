import React from 'react'
import { Link } from 'react-router-dom'
import "./Footer.css"

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-top'>
        {/* Brand Section */}
        <div className="footer-brand">
          <h3>AI-Mart</h3>
          <p>Discover, compare, and master the best AI tools in the market. Built for the future of work.</p>
        </div>

        {/* Product Links */}
        <div className="footer-links">
          <h4>Product</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/explore">Explore</Link></li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="sugamsingh022@gmail.com">support@aimart.com</a></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Developer Section */}
        <div className="footer-links">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://github.com/Sugam0394" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href="www.linkedin.com/in/sugam-singh-2693a6386" target="_blank" rel="noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>© 2026 AI-Mart. Engineered for Scale.</p>
      </div>
    </footer>
  )
}

export default Footer 