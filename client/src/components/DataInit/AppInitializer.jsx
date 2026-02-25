 import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { syncUserRole, setInitialized, logout } from '../../app/features/AuthSlice';
import { fetchSavedTools } from '../../app/features/SavedSlice';
import { getAccessToken } from '../../utils/token';
import toast from 'react-hot-toast';

const AppInitializer = () => {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // 🚀 FIX: Backend Wake-up Polling (Bug #5)
    const wakeUpBackend = async (retries = 5) => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/health`);
          if (res.ok) {
            console.log("🟢 Backend is awake!");
            return true;
          }
        } catch (err) {
          console.error("🔴 Wake-up attempt failed:", err);
          console.warn(`🐢 Backend sleeping... Attempt ${i + 1}/${retries}`);
          // Pehli attempt pe user ko batao ki server warm up ho raha hai
          if (i === 0) toast.loading("Server is warming up... please wait.", { id: "warmup" });
        }
        // 3 second wait karo agle try se pehle
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      toast.error("Server is taking too long. Try refreshing.", { id: "warmup" });
      return false;
    };

    const initializeApp = async () => {
      // 1. Pehle server ko jagao
      await wakeUpBackend();
      toast.dismiss("warmup");

      const token = getAccessToken();
      
      if (!token) {
        console.log("ℹ️ No token found, app initialized as guest.");
        dispatch(setInitialized());
        return;
      }

      try {
        console.log("📡 Syncing session...");
        // 2. Ab sync karo kyunki humein pata hai server awake hai
        await dispatch(syncUserRole()).unwrap();
        await dispatch(fetchSavedTools());
      } catch (error) {
        console.error("🔴 Auth Sync Failed:", error);
        
        const isAuthError = 
          error?.response?.status === 401 || 
          error === 'No user data';

        if (isAuthError) {
          console.warn("🔐 Session expired, logging out...");
          dispatch(logout());
        }
      } finally {
        dispatch(setInitialized());
      }
    };

    initializeApp();
  }, [dispatch]);

  return null;
};

export default AppInitializer;