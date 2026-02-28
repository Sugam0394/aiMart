 import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../app/features/AuthSlice';// 1. Sahi thunk import karein
import './LogoutButton.css'
const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // 2. Server + Local dono logout trigger karein
    await dispatch(logoutUser()); 
    navigate('/', { replace: true });
  };

  return (
 // ✅ FIX: Class name "logout-btn-v3" rakho taaki CSS match ho jaye
    <button onClick={handleLogout} className="logout-btn-v3">
      Logout
    </button>
  );
};

export default Logout;
