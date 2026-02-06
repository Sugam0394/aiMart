import React from 'react'
import './FounderSidebar.css'

function FounderSidebar({ activeView, setActiveView }) {
  return (
    <aside className="founder-sidebar">
      <div className="sidebar-header">
        <div className="admin-status">
          <span className="pulse-dot"></span>
          FOUNDER PANEL
        </div>
      </div>

      <ul className="sidebar-menu">
        {/* Section 1: Tool Owners */}
        <li className="menu-label">Tool Owners</li>
        
        <li
          className={`menu-item ${activeView === "pendingTO" ? "active" : ""}`}
          onClick={() => setActiveView("pendingTO")}
        >
          <span className="dot-icon"></span> Pending Requests
        </li>

        <li
          className={`menu-item ${activeView === "approvedTO" ? "active" : ""}`}
          onClick={() => setActiveView("approvedTO")}
        >
          <span className="dot-icon"></span> Approved Owners
        </li>

        {/* Section 2: Tool Submissions */}
        <li className="menu-label">Tool Submissions</li>

        <li
          className={`menu-item ${activeView === "pendingTF" ? "active" : ""}`}
          onClick={() => setActiveView("pendingTF")}
        >
          <span className="dot-icon"></span> Form Requests
        </li>

        <li
          className={`menu-item ${activeView === "approvedTF" ? "active" : ""}`}
          onClick={() => setActiveView("approvedTF")}
        >
          <span className="dot-icon"></span> Published Tools
        </li>
      </ul>
      
      <div className="sidebar-footer">
        <p>© 2026 AI Bridge</p>
      </div>
    </aside>
  )
}

export default FounderSidebar;