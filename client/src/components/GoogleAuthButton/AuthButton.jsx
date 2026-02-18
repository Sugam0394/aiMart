import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { googleLogin } from '../../app/features/AuthSlice';

const GoogleAuthButton = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response) => {
    setIsLoggingIn(true);
    try {
      const resultAction = await dispatch(googleLogin(response.credential));
      
      if (googleLogin.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        toast.success(`Welcome back, ${user.name}! 🚀`);

        if (user.role === "toolOwner") {
          navigate("/toolowner/dashboard");
        } else if (user.role === "founder") {
          navigate("/founder/dashboard");
        } else {
          navigate("/explore");
        }
      } else {
        toast.error(resultAction.payload || "Google Authentication failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Google Auth Error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In was unsuccessful. Try again.");
  };

  return (
    <div className="google-btn-wrapper">
      <div className={`google-btn-inner ${isLoggingIn ? 'processing' : ''}`}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline" // ✅ White background ke liye
          shape="rectangular" // ✅ Professional look ke liye
          size="large"
          width="100%" // Container ki width lega
          text="continue_with"
        />
      </div>
      
      {isLoggingIn && (
        <p className="verifying-text">
          Verifying your account...
        </p>
      )}
    </div>
  );
};

export default GoogleAuthButton; 