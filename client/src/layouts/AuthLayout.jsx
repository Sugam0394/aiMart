import React from "react";
import { Outlet } from "react-router-dom";
import AuthNavbar from "../components/navbar/AuthNavbar";
import "./AuthLayout.css"
 
 

function AuthLayout() {
  return (
      <div className="auth-layout">
      {/* 🔝 Top Navbar for login/register */}
      <AuthNavbar />

      {/* 📦 Page Content */}
      <main className="auth-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
