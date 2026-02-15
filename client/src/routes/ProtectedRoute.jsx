import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
 
 
 

 // ProtectedRoute.jsx
function ProtectedRoute({ allowedRoles }) {
  const { user, role, loading, isInitialized } = useSelector((state) => state.auth);

  // 1. Agar abhi initialized hi nahi hua toh wait karo (No blank screen)
  if (!isInitialized && loading) {
    return <div className="loading-screen">Loading...</div>; // Ya skeleton
  }

  // 2. Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Check role from user object as fallback
  const currentRole = role || user.role;

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    // Agar galat jagah aa gaya hai user
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute