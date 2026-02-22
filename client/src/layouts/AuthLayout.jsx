 import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google"; 
import AuthNavbar from "../components/navbar/AuthNavbar";
import "./AuthLayout.css";

function AuthLayout() {
  const { user } = useSelector((state) => state.auth);

  // ⚡ Optimization: Loading block hata diya taaki layout turant dikhe.
  // Initialization check ProtectedRoute aur App.jsx handle karenge.

  if (user) {
    const paths = {
      user: "/explore",
      toolOwner: "/toolowner/dashboard",
      founder: "/founder/dashboard",
    };
    return <Navigate to={paths[user.role] || "/explore"} replace />;
  }

  return (
    // ✅ Google Provider ab sirf Auth pages ko wrap kar raha hai
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="auth-layout">
        <AuthNavbar />
        <main className="auth-content">
          <Outlet />
        </main>
      </div>
    </GoogleOAuthProvider>
  );
}

export default AuthLayout;
