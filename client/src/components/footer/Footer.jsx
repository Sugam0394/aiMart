import React from 'react';
import { Link } from 'react-router-dom';
import "./Footer.css";

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-top'>
        {/* Brand Section */}
        <div className="footer-brand">
          <h3 className="footer-logo">AI-Mart</h3>
          <p>The ultimate discovery platform for the world's best AI tools.</p>
        </div>

        {/* Support Section */}
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="mailto:sugamsingh022@gmail.com">sugam@aimart.com</a></li>
          </ul>
        </div>

        {/* Team Section */}
        <div className="footer-links">
          <h4>Team</h4>
          <ul>
            <li>
              <a 
                href="https://www.linkedin.com/in/sugam-singh-2693a6386" 
                target="_blank" 
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>© 2026 AI-Mart. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer; 