 import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { googleLogin } from '../../app/features/AuthSlice';
import './AuthButton.css';

const GoogleAuthButton = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/explore";

  const handleGoogleSuccess = async (response) => {
    if (isLoggingIn) return; // Prevent multiple clicks

    setIsLoggingIn(true);
    const toastId = toast.loading("Logging in with Google...");
    
    try {
      const resultAction = await dispatch(googleLogin(response.credential));
      
      if (googleLogin.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        toast.success(`Welcome back, ${user.name}! 🚀`, { id: toastId });

        const paths = {
          toolOwner: "/toolowner/dashboard",
          founder: "/founder/dashboard"
        };
        
        navigate(paths[user.role] || from, { replace: true });
      } else {
        toast.error(resultAction.payload || "Google Authentication failed", { id: toastId });
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("An unexpected error occurred. Please try again.", { id: toastId });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In was unsuccessful. Try again.");
    setIsLoggingIn(false);
  };

  return (
    <div className="google-btn-container" style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}>
      <div 
        className="google-btn-inner" 
        style={{ 
          width: '100%',
          opacity: isLoggingIn ? 0.6 : 1,
          pointerEvents: isLoggingIn ? 'none' : 'auto', // 🛡️ Disable clicks during processing
          transition: 'opacity 0.2s ease'
        }}
      >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          shape="rectangular"
          size="large"
          width="320" // String format use karein for safety
          text="continue_with"
        />
      </div>
      
      {/* 🛠️ Reserved space for status text - Stops layout jumping */}
      <div style={{ minHeight: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isLoggingIn && (
          <p className="verifying-text" style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '500' }}>
            Verifying your account...
          </p>
        )}
      </div>
    </div>
  );
};

export default GoogleAuthButton;