 import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../api/axios";


 const useTrendingForYou = () => {
  const { detectedIntents = [] } = useSelector((state) => state.moment || {});
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true); // Default loading true rakho
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingTools = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ Intents ho toh query bhejo, varna empty bhejo (Backend fallback handle kar lega)
        const params = detectedIntents.length > 0 ? { intent: detectedIntents.join(",") } : {};
        
        const response = await api.get("/trending", { params });
        setTools(response.data.data || []);
      } catch (err) {
        
        setError("Failed to load trending tools." , err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTools();
  }, [detectedIntents]); // Jab intent update ho, tab re-fetch ho

  return { tools, loading, error };
};

export default useTrendingForYou;

