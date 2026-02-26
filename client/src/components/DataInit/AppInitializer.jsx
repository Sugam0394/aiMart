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

    // 🚀 Backend Wake-up Polling
    const wakeUpBackend = async (retries = 5) => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/health`);
          if (res.ok) {
            console.log("🟢 Backend is awake!");
            return true;
          }
        } catch (err) {
          console.error("🔴 Wake-up attempt failed:", err);
          console.warn(`🐢 Backend sleeping... Attempt ${i + 1}/${retries}`);
          if (i === 0) toast.loading("Server is warming up...", { id: "warmup" });
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      toast.error("Server unreachable. Try refreshing.", { id: "warmup" });
      return false;
    };

    const initializeApp = async () => {
      // 1. Backend check
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
        
        // Step A: Sync user profile
        const user = await dispatch(syncUserRole()).unwrap();
        
        // Step B: If user valid, fetch inventory (Bug #3 Fix)
        if (user) {
          console.log("📦 Loading user inventory...");
          await dispatch(fetchSavedTools());
        }

      } catch (error) {
        console.error("🔴 Auth Sync Failed:", error);
        if (error?.status === 401 || error?.response?.status === 401) {
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