import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
 import { fetchSavedTools } from '../../app/features/SavedSlice';

const DataInitializer = () => {
  const dispatch = useDispatch();
  // Hum check karenge ki user logged in hai ya nahi (localStorage se ya auth state se)
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      console.log("🚀 Initializing Global Data...");
      dispatch(fetchSavedTools());
      // In future: tum yahan dispatch(fetchUserProfile()) bhi daal sakte ho
    }
  }, [dispatch, token]);

  return null; // Ye screen par kuch nahi dikhayega
};

export default DataInitializer;