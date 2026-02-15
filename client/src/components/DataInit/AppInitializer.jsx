// AppInitializer.jsx - FINAL FIXED VERSION
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { syncUserRole, setInitialized, logout } from "../../app/features/AuthSlice";
import { fetchSavedTools } from "../../app/features/SavedSlice";
import { getAccessToken } from "../../utils/token";

const AppInitializer = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // ✅ isInitialized hata diya
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const token = getAccessToken();

    if (token && !user) {
      hasInitialized.current = true;
      dispatch(syncUserRole())
        .unwrap()
        .then(() => {
          dispatch(fetchSavedTools());
        })
        .catch(() => {
          dispatch(logout());
        });
    } else if (token && user) {
      hasInitialized.current = true;
      dispatch(setInitialized());
      dispatch(fetchSavedTools());
    } else {
      hasInitialized.current = true;
      dispatch(setInitialized());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // ✅ user deliberately exclude kiya to prevent loop

  return null;
};

export default AppInitializer; 