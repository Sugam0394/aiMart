import React from 'react'
 
 import { NavLink, Outlet } from "react-router-dom";
import './ToolOwnerLayout.css'


function ToolOwnerLayout() {

  
 

     return (
<div className="toolowner-layout">

      {/* 🔝 TOP NAVBAR */}
      <nav className="top-navbar">
        <h2 >
          AI Mart
        </h2>

        <div className="nav-links">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          <NavLink to="/toolowner/dashboard">Dashboard</NavLink>
           <NavLink to="/toolowner/settings">Settings</NavLink> 
        </div>

        <div className="nav-right">
          ToolOwner
        </div>
      </nav>

      {/* 🔻 PAGE CONTENT */}
      <Outlet />
    </div>
     )
  
}

export default ToolOwnerLayout