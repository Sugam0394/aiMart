import React from 'react'
import { NavLink } from "react-router-dom";
import './ToolOwnerSidebar.css'



function ToolOwnerSidebar() {
  return (
     <aside className="toolowner-sidebar">
      <h3>AI-MART</h3>

      <nav>
        <NavLink to="/toolowner/dashboard">Dashboard</NavLink>
        <NavLink to="/toolowner/create-tool">Create Tool</NavLink>
        <NavLink to="/toolowner/my-tool">My Tools</NavLink>
      </nav>
    </aside> 
  )
}

export default ToolOwnerSidebar