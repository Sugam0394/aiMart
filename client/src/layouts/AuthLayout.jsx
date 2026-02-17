import React from "react";
import { Outlet, Navigate } from "react-router-dom"; // Navigate add kiya
import { useSelector } from "react-redux"; // useSelector add kiya
import AuthNavbar from "../components/navbar/AuthNavbar";
import "./AuthLayout.css";

function AuthLayout() {
  const { user, isInitialized } = useSelector((state) => state.auth);

  // Jab tak system check kar raha hai, tab tak wait karo
  if (!isInitialized) {
    return null; // Ya loading spinner
  }

  // Agar user already logged in hai, toh use login/register mat dikhao
  // Seedhe uske dashboard par bhej do
  if (user) {
    const paths = {
      user: "/explore",
      toolOwner: "/toolowner/dashboard",
      founder: "/founder/dashboard",
    };
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
