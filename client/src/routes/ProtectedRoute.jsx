 import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SkeletonLoader from '../components/SkeletonLoader/SkeletonLoader';

function ProtectedRoute({ allowedRoles }) {
  const { user, isInitialized,  } = useSelector((state) => state.auth);
  const location = useLocation();

 
  if (!isInitialized && localStorage.getItem("accessToken")) {
    return (
       <div className="layout-wrapper" style={{ padding: '2rem' }}>
        <SkeletonLoader type="dashboard" /> 
      </div>
    );
  }

  
  if (isInitialized && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

 
  const currentRole = user?.role;
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    const defaultPath = currentRole === "toolOwner" ? "/toolowner/dashboard" : "/explore";
    return <Navigate to={defaultPath} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;