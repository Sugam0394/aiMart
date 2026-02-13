import React, { useEffect, useState } from "react";
import axios from "axios";
 import ToolCard from '../../aiArt/components/ToolCard'
 import './Recommend.css'

 const RecommendedSection = ({ onDataLoaded }) => {
  const [tools, setTools] = useState([]); // Initial empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const interests = JSON.parse(localStorage.getItem("user_interests") || "[]");
        const tagsParam = interests.length > 0 ? `?tags=${interests.join(",")}` : "";
        
        const res = await axios.get(`/api/recommend${tagsParam}`);
        
        // Safety check: Agar res.data.data exist karta hai tabhi set karo
        const toolsData = res.data?.data || [];
        setTools(toolsData);

        if (onDataLoaded) {
          onDataLoaded(res.data?.basedOnInterests || false);
        }
      } catch (err) {
        console.error("Error fetching recommendations", err);
        setTools([]); // Error case mein empty array set karo taaki length check na phate
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, [onDataLoaded]);

  if (loading) return <div>Loading...</div>;

  // Ab ye kabhi nahi phatega
  if (!tools || tools.length === 0) return null;

  return (
    <div className="usecase-row-container">
      {tools.map((tool) => (
        <ToolCard key={tool._id} tool={tool} />
      ))}
    </div>
  );
};

export default RecommendedSection;