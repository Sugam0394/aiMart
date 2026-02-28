 import React from 'react';
import { Link } from 'react-router-dom'; // Curly braces added here

function Footer() {
  const leftAlignStyle = {
    textAlign: 'left',
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  };

  return (
    <footer className='footer' style={{ 
      ...leftAlignStyle, 
      padding: '4rem 20px 2rem 20px', 
      /* FIX: Dark background and border */
      backgroundColor: 'var(--bg-main, #020617)',
      borderTop: '1px solid var(--color-border, #1e293b)',
      boxSizing: 'border-box'
    }}>
      
      <div className='footer-top' style={{ 
        ...leftAlignStyle, 
        maxWidth: '1200px', 
        margin: '0 auto 3rem 0', 
        gap: '2.5rem'
      }}>
        
        <div className="footer-brand" style={leftAlignStyle}>
          <h3 className="footer-logo" style={{ 
            color: 'var(--brand-indigo, #4F46E5)', 
            fontSize: '1.8rem', 
            fontWeight: '800', 
            marginBottom: '1rem',
            textAlign: 'left'
          }}>AI-Mart</h3>
          <p style={{ 
            /* FIX: Secondary text color */
            color: 'var(--color-text-secondary, #94a3b8)', 
            margin: '0', 
            textAlign: 'left',
            maxWidth: '300px'
          }}>
            The ultimate discovery platform for the world's best AI tools.
          </p>
        </div>

        <div className="footer-links" style={leftAlignStyle}>
          {/* FIX: Primary text color */}
          <h4 style={{ color: 'var(--color-text-primary, #f8fafc)', marginBottom: '1.2rem', textAlign: 'left', fontSize: '0.9rem', textTransform: 'uppercase' }}>Support</h4>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0', textAlign: 'left' }}>
            <li>
              <a href="mailto:sugamsingh022@gmail.com" style={{ color: 'var(--color-text-secondary, #94a3b8)', textDecoration: 'none' }}>
                sugam@aimart.com
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-links" style={leftAlignStyle}>
          {/* FIX: Primary text color */}
          <h4 style={{ color: 'var(--color-text-primary, #f8fafc)', marginBottom: '1.2rem', textAlign: 'left', fontSize: '0.9rem', textTransform: 'uppercase' }}>Team</h4>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0', textAlign: 'left' }}>
            <li>
              <a 
                href="https://www.linkedin.com/in/sugam-singh-2693a6386" 
                target="_blank" 
                rel="noreferrer"
                /* FIX: Secondary text color */
                style={{ color: 'var(--color-text-secondary, #94a3b8)', textDecoration: 'none' }}
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className='footer-bottom' style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        textAlign: 'left', 
        /* FIX: Dark border and muted text */
        borderTop: '1px solid var(--color-border, #1e293b)', 
        paddingTop: '2rem',
        color: '#64748B',
        fontSize: '0.85rem'
      }}>
        <p style={{ margin: '0', textAlign: 'left' }}>© 2026 AI-Mart. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;