import React from 'react'
import "./Footer.css"

function Footer() {
  return (
     <footer className='footer'>
      <div className='container footer-top'>
        {/* Brand */}
        <div>
          <h3>AI-Mart</h3>
          <p>One place for all AI tools</p>
        </div>

        {/* Resources / Meta */}
        <div>
          <h4>Resources</h4>
          <ul>
            <li>Privacy Policy</li>
            <li>GitHub</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div>
        <p>© 2026 AI-Mart. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer