import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

 function ProtectedRoute({ allowedRoles }) {
  const { user, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();

 
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mb-4"></div>
          <p className="text-white">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // 2. Ab confirm hai ki initialization ho gayi. Agar user nahi hai, tabhi bhejo login pe
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = user.role;
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    const defaultPath = currentRole === "user" ? "/explore" : "/toolowner/dashboard";
    return <Navigate to={defaultPath} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute; 