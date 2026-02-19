 import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { syncUserRole, setInitialized, logout } from "../../app/features/AuthSlice";
import { fetchSavedTools } from "../../app/features/SavedSlice";
import { getAccessToken } from "../../utils/token";

const AppInitializer = () => {
  const dispatch = useDispatch();
 
  const hasInitialized = useRef(false);

  useEffect(() => {
    
    if (hasInitialized.current) return;

    const token = getAccessToken();

    if (token) {
      hasInitialized.current = true;
     
      dispatch(syncUserRole())
        .unwrap()
        .then(() => {
   
          dispatch(fetchSavedTools());
        })
        .catch(() => {
        
          dispatch(logout());
        });
    } else {
       
      hasInitialized.current = true;
      dispatch(setInitialized());
    }
    
 
  }, [dispatch]);

  return null;
};

export default AppInitializer;