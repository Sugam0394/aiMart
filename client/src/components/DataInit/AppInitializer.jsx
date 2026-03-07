 import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { syncUserRole, setInitialized, logout } from '../../app/features/AuthSlice';
import { fetchSavedTools } from '../../app/features/SavedSlice';
import { getAccessToken, setAccessToken } from '../../utils/token';
import axios from 'axios';
import toast from 'react-hot-toast';

const AppInitializer = () => {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);
  const refreshTimeoutRef = useRef(null);
  const refreshFunctionRef = useRef(null);

  const scheduleProactiveRefresh = useCallback(() => {
  
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const THIRTEEN_MINUTES = 13 * 60 * 1000;

    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        if (!getAccessToken()) return;

        console.log("🔄 Proactive refresh starting...");
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/refreshToken`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data?.data?.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          console.log("✅ Proactive refresh success");
          
          // ✅ Use the ref to call the function recursively
          if (refreshFunctionRef.current) {
            refreshFunctionRef.current();
          }
        }
      } catch (e) {
        console.error('❌ Proactive refresh failed:', e);
        if (e.response?.status === 403) {
          dispatch(logout());
        }
      }
    }, THIRTEEN_MINUTES);
  }, [dispatch]);

  // ✅ Update the ref whenever the function changes
  useEffect(() => {
    refreshFunctionRef.current = scheduleProactiveRefresh;
  }, [scheduleProactiveRefresh]);

 
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        console.log("🧹 Proactive refresh timer cleared");
      }
    };
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const wakeUpBackend = async (retries = 10) => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/health`);
          if (res.ok) {
            console.log("🟢 Backend is awake!");
            return true;
          }
        } catch (err) {

          console.log(`⚠️ Backend wake-up attempt ${i + 1} failed.` , err);
          if (i === 0) toast.loading("Server is warming up...", { id: "warmup" });
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      toast.error("Server unreachable.", { id: "warmup" });
      return false;
    };

    const initializeApp = async () => {
   
      const backendReady = await wakeUpBackend();
      toast.dismiss("warmup");

      if (!backendReady) {
        dispatch(setInitialized());
        return;
      }




      if (!getAccessToken()) {
        dispatch(setInitialized());
        return;
      }

     { /* dispatch(setInitialized()); */ }

      try {
        const userData = await dispatch(syncUserRole()).unwrap();
        if (userData) {
          scheduleProactiveRefresh(); 
          await dispatch(fetchSavedTools());
        }
      } catch (error) {
        console.error("🔴 Auth Sync Failed:", error);
        } finally {
         
      { /* dispatch(setInitialized()); */ }
        }
      }
    initializeApp();
  }, [dispatch, scheduleProactiveRefresh]); 

  return null;
};

export default AppInitializer;