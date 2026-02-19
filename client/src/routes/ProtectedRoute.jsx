import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ allowedRoles }) {
 
  const { user, loading, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();  

 
  if (!isInitialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  
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