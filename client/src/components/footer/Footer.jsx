import React from 'react'
import { Link } from 'react-router-dom'
import "./Footer.css"

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-top'>
        {/* Brand Section */}
        <div className="footer-brand">
          <h3 className="footer-logo">AI-Mart</h3>
          <p>The discovery platform for AI tools.</p>
        </div>

        {/* Support Section */}
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            {/* mailto: lagane se click karte hi email box khul jayega */}
            <li><a href="mailto:sugamsingh022@gmail.com">sugam@aimart.com</a></li>
          </ul>
        </div>

        {/* Founder Connect */}
        <div className="footer-links">
          <h4>Team</h4>
          <ul>
            <li>
              {/* FIXED: https:// add kiya hai taaki external link sahi chale */}
              <a href="https://www.linkedin.com/in/sugam-singh-2693a6386" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>© 2026 AI-Mart.</p>
      </div>
    </footer>
  )
}

export default Footer 