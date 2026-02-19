 import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { syncUserRole, setInitialized, logout } from '../../app/features/AuthSlice';
import { fetchSavedTools } from '../../app/features/SavedSlice';
import { getAccessToken } from '../../utils/token';

const AppInitializer = () => {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const token = getAccessToken();

    if (token) {
      dispatch(syncUserRole())
        .unwrap()
        .then(() => {
          dispatch(fetchSavedTools());
        })
        .catch((error) => {
          // ✅ FIX: Network error aur auth error alag handle karo
          const isAuthError =
            error === 'No user data' ||
            (typeof error === 'string' &&
              error.toLowerCase().includes('unauthorized')) ||
            (typeof error === 'object' && error?.status === 401);

          if (isAuthError) {
            // Actual auth failure → logout
            dispatch(logout());
          } else {
            // Network error / server down → session safe rakho
            dispatch(setInitialized());
          }
        });
    } else {
      dispatch(setInitialized());
    }
  }, [dispatch]);

  return null;
};

export default AppInitializer;