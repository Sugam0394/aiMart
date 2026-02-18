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
      // 1. Dispatching the Google Login Thunk (Jo humne authSlice mein banaya)
      const resultAction = await dispatch(googleLogin(response.credential));
      
      // 2. Checking if the action was successful
      if (googleLogin.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        toast.success(`Welcome back, ${user.name}! 🚀`);

        // 3. Role-based Redirection
        if (user.role === "toolOwner") {
          navigate("/toolowner/dashboard");
        } else if (user.role === "founder") {
          navigate("/founder/dashboard");
        } else {
          navigate("/explore");
        }
      } else {
        // Redux thunk ka error handle karega
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
    <div className={`w-full transition-all duration-300 ${isLoggingIn ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap // ✨ Feature: Popup for returning users
        theme="filled_black" // Dark theme ke liye perfect
        shape="pill"
        size="large"
        width="250" // Container ki puri width
      />
      
      {isLoggingIn && (
        <p className="text-[10px] text-center mt-2 text-gray-500 animate-pulse tracking-wider uppercase">
          Verifying your account...
        </p>
      )}
    </div>
  );
};

export default GoogleAuthButton; 