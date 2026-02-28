 import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { syncUserRole, setInitialized, logout } from '../../app/features/AuthSlice';
import { fetchSavedTools } from '../../app/features/SavedSlice';
import { getAccessToken , setAccessToken } from '../../utils/token';
import axios from 'axios'
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

    // ✅ NEW: Proactive refresh function added here [cite: 24, 25]
    const scheduleProactiveRefresh = () => {
      const THIRTEEN_MINUTES = 13 * 60 * 1000; // Refresh 2 min before 15-min expiry
      setTimeout(async () => {
        try {
          // Using axios directly to avoid interceptor recursion
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/refreshToken`,
            {},
            { withCredentials: true }
          );
          const newToken = res.data?.data?.accessToken;
          if (newToken) {
            setAccessToken(newToken);
            scheduleProactiveRefresh(); // Schedule next rotation automatically
          }
        } catch (e) {
          console.error('Proactive refresh failed:', e);
          // Interceptor will handle it reactively if this fails
        }
      }, THIRTEEN_MINUTES);
    };

   const initializeApp = async () => {
  // 1. Backend ko uthao (Warm up)
  await wakeUpBackend();
  toast.dismiss("warmup");

  const token = getAccessToken();
  
  
  if (!token) {
    console.log("ℹ️ No token found, app initialized as guest.");
    dispatch(setInitialized());
    return;
  }

 
  dispatch(setInitialized()); 

  try {
    console.log("📡 Syncing session in background...");
    
    // Background mein user sync karo
    const user = await dispatch(syncUserRole()).unwrap();
    
    if (user) {
      console.log("📦 Loading user inventory...");

    scheduleProactiveRefresh(); // Start proactive token refresh cycle



      await dispatch(fetchSavedTools());
    }
  } catch (error) {
    console.error("🔴 Auth Sync Failed:", error);
    if (!getAccessToken()) {
    console.log("ℹ️ Access token lost, logging out...");
    dispatch(logout()); // Redux state clear karega
  
}
  }
  // Note: Finally block se dispatch(setInitialized()) hata diya kyunki upar kar diya hai
};

    initializeApp();
  }, [dispatch]);

  return null;
};

export default AppInitializer;