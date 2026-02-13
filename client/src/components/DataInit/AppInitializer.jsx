import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { syncUserRole , setInitialized  } from "../../app/features/AuthSlice"; // setInitialized ko import karo
import { fetchSavedTools } from "../../app/features/SavedSlice";
import { getAccessToken } from "../../utils/token";
import { logout } from "../../app/features/AuthSlice";
 

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
  const token = getAccessToken();

  if (token) {
    dispatch(syncUserRole())
      .unwrap()
      .then(() => {
        dispatch(fetchSavedTools());
      })
      .catch(() => {
        // agar sync fail ho gaya → logout kar do
        dispatch(logout());
      });
  } else {
    dispatch(setInitialized());
  }
}, [dispatch]);


  return null;
};

export default AppInitializer; 