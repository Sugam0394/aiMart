import { useEffect } from "react";
import { useDispatch } from "react-redux";
 import { syncUserRole } from "../../app/features/AuthSlice";
import { fetchSavedTools } from "../../app/features/SavedSlice";
import { getAccessToken } from "../../utils/token";

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getAccessToken();

    if (token) {
      // 1. User ka latest data (profile, role) backend se sync karo
      // Isse refresh par logout wala issue fix ho jayega
      dispatch(syncUserRole());

      // 2. Uske saved tools bhi fetch kar lo
      dispatch(fetchSavedTools());
    }
  }, [dispatch]);

  return null; // Ye sirf logic ke liye hai, UI ke liye nahi
};

export default AppInitializer;