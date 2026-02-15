import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // useSelector add kiya
import { syncUserRole, setInitialized, logout } from "../../app/features/AuthSlice";
import { fetchSavedTools } from "../../app/features/SavedSlice";
import { getAccessToken } from "../../utils/token";

const AppInitializer = () => {
  const dispatch = useDispatch();
  
  // ✅ Problem Solve: user ko state se nikaalo
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = getAccessToken();

    if (token && !user) {
      // Case 1: Token hai par state khali hai (e.g. Refresh ya Fresh Login)
      dispatch(syncUserRole())
        .unwrap()
        .then(() => {
          dispatch(fetchSavedTools());
        })
        .catch(() => {
          dispatch(logout());
        });
    } else if (token && user) {
      // Case 2: Token bhi hai aur user state mein bhi hai (e.g. Just Registered/Logged in)
      dispatch(setInitialized());
      dispatch(fetchSavedTools());
    } else {
      // Case 3: Token nahi hai
      dispatch(setInitialized());
    }
    
    // dependency array mein user aur dispatch zaruri hain
  }, [dispatch, user]); 

  return null;
};

export default AppInitializer; 