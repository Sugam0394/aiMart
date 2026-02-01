import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';
 import UseRoleSync from '../components/toolOwner/UseRoleSync';
 
 

function ProtectedRoute( { allowedRoles}) {
 
  const { user, role, loading } = useSelector((state) => state.auth);
      
 // ⏳ Auth loading
  if (loading) return null; // or loader

  
  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }


 

 


  // 3. Access granted
  return  <Outlet />
}

export default ProtectedRoute