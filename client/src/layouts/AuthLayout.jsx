import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthNavbar from "../components/navbar/AuthNavbar";
import "./AuthLayout.css";

function AuthLayout() {
  const { user, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) return <div className="loading-screen">Verifying...</div>;

  if (user) {
    // 💡 Paths object ka use karo taaki ESLint error na de
    const paths = {
      user: "/explore",
      toolOwner: "/toolowner/dashboard",
      founder: "/founder/dashboard",
    };

    // Yahan paths[user.role] use kar lo, simple!
    return <Navigate to={paths[user.role] || "/explore"} replace />;
  }

  return (
    <div className="auth-layout">
      <AuthNavbar />
      <main className="auth-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout; 
