import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { googleLogin } from '../../app/features/AuthSlice';

const GoogleAuthButton = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/explore";

  const handleGoogleSuccess = async (response) => {
    setIsLoggingIn(true);
    const toastId = toast.loading("Logging in with Google...");
    try {
      const resultAction = await dispatch(googleLogin(response.credential));
      
      if (googleLogin.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        toast.success(`Welcome back, ${user.name}! 🚀`, { id: toastId });

        if (user.role === "toolOwner") {
          navigate("/toolowner/dashboard", { replace: true });
        } else if (user.role === "founder") {
          navigate("/founder/dashboard", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
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
  };

  return (
    <div className="google-btn-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div className={`google-btn-inner ${isLoggingIn ? 'processing' : ''}`} style={{ width: '100%' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          shape="rectangular"
          size="large"
          width={320} 
          text="continue_with"
        />
      </div>
      
      {isLoggingIn && (
        <p className="verifying-text" style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          Verifying your account...
        </p>
      )}
    </div>
  );
};

export default GoogleAuthButton; 