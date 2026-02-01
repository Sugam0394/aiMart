import React from 'react'
import './FounderSidebar.css'

function FounderSidebar( { activeView , setActiveView}) {
  return (
    <aside className="founder-sidebar">
      <h2 className="sidebar-title">Founder Panel</h2>

      <ul className="sidebar-menu">
        <li
          className={`menu-item ${activeView === "pendingTO" ? "active" : ""}`}
          onClick={() => setActiveView("pendingTO")}
        >
          ToolOwner Pending Requests
        </li>

        <li
          className={`menu-item ${activeView === "approvedTO" ? "active" : ""}`}
          onClick={() => setActiveView("approvedTO")}
        >
          Approved ToolOwners
        </li>

        <li
          className={`menu-item ${activeView === "pendingTF" ? "active" : ""}`}
          onClick={() => setActiveView("pendingTF")}
        >
          Pending ToolForm Requests
        </li>

        <li
          className={`menu-item ${activeView === "approvedTF" ? "active" : ""}`}
          onClick={() => setActiveView("approvedTF")}
        >
          Approved ToolForm Requests
        </li>
      </ul>
    </aside>
  )
}

export default FounderSidebar