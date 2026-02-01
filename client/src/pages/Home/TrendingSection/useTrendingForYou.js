 import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../api/axios";

const useTrendingForYou = () => {
  // ✅ Redux slice se detected intents
  const { detectedIntents = [] } = useSelector((state) => state.moment || {});

  // ✅ Local state
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Agar detectedIntents empty → fetch mat karo
    if (!detectedIntents || detectedIntents.length === 0) {
      setTools([]);
      setLoading(false);
      return;
    }

    const fetchTrendingTools = async () => {
      setLoading(true);
      setError(null);

      try {
        const intentQuery = detectedIntents.join(",");
        const response = await api.get("/trending", {
          params: { intent: intentQuery },
        });

        setTools(response.data.data || []);
      } catch (err) {
        console.error("Error fetching trending tools:", err);
        setError("Failed to load trending tools. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTools();
  }, [detectedIntents]);

  return { tools, loading, error };
};

export default useTrendingForYou;

