import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../app/features/AuthSlice';
import './LogoutButton.css';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); 
    // Replace: true se browser history clean rehti hai
    navigate('/', { replace: true }); 
  };

  return (
    <button onClick={handleLogout} className="logout-btn-v3">
      <span className="logout-icon">🚪</span>
      <span>Sign Out</span>
    </button>
  );
};

export default LogoutButton; 
