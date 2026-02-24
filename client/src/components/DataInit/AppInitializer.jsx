 import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { syncUserRole, setInitialized, logout } from '../../app/features/AuthSlice';
import { fetchSavedTools } from '../../app/features/SavedSlice';
import { getAccessToken } from '../../utils/token';

const AppInitializer = () => {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 🚀 PERF 1: Backend Wake-up Ping (Cold Start Fix)
    // App load hote hi backend ko silently jagao
    fetch(`${import.meta.env.VITE_API_URL}/health`).catch(() => {});

    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeApp = async () => {
      const token = getAccessToken();
      
      if (!token) {
        console.log("ℹ️ No token found, app initialized as guest.");
        dispatch(setInitialized());
        return;
      }

      try {
        console.log("📡 Syncing session...");
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