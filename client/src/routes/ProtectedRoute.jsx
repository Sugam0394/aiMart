import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ allowedRoles }) {
  // Redux store se values nikaalo
  const { user, loading, isInitialized } = useSelector((state) => state.auth);

  // 1. Agar abhi sync chal raha hai, toh loading screen dikhao
  // Jab tak isInitialized false hai, humein nahi pata user logged in hai ya nahi
  if (!isInitialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 2. Agar initialization khatam ho gayi aur user nahi mila -> Login bhej do
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. User mil gaya, ab Role check karo
  const currentRole = user.role;

  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    // Agar role match nahi karta, toh dashboard par redirect karo
    const defaultPath = currentRole === "user" ? "/explore" : "/toolowner/dashboard";
    return <Navigate to={defaultPath} replace />;
  }

  // Sab sahi hai toh page dikhao
  return <Outlet />;
}

export default ProtectedRoute; 