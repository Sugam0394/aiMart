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
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
};

export default Logout;
