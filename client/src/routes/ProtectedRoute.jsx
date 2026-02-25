 import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ allowedRoles }) {
  const { user, isInitialized,  } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. Agar initialization ho rahi hai AUR user ka access token hai (matlab session check chal raha hai)
  // Tabhi spinner dikhao. Bina token waale guest ko seedha navigate karne do.
  if (!isInitialized && localStorage.getItem("accessToken")) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mb-4 mx-auto"></div>
          <p className="text-white">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // 2. Initialization complete hone ke baad check karo: User hai ya nahi?
  if (isInitialized && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role-based access control
  const currentRole = user?.role;
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    const defaultPath = currentRole === "toolOwner" ? "/toolowner/dashboard" : "/explore";
    return <Navigate to={defaultPath} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;