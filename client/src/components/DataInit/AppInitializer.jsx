import { useEffect } from "react";
import { useDispatch } from "react-redux";
 import { syncUserRole } from "../../app/features/AuthSlice";
import { fetchSavedTools } from "../../app/features/SavedSlice";
import { getAccessToken } from "../../utils/token";

const AppInitializer = () => {
  const dispatch = useDispatch();

 useEffect(() => {
  const token = getAccessToken();
  // Sirf tab call karein jab token ho (Refresh case)
  if (token) {
    dispatch(syncUserRole());
    dispatch(fetchSavedTools());
  }
}, [dispatch]);

  return null; // Ye sirf logic ke liye hai, UI ke liye nahi
};

export default AppInitializer;