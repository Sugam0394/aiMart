import React, { useEffect, useState } from "react";
import { getRecommendedTools } from "../../../api/toolOwner/tool.services";
import ToolCard from '../../aiArt/components/ToolCard';
import './Recommend.css';

const RecommendedSection = ({ onDataLoaded }) => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommended = async () => {
      try {
        const { tools, basedOnInterests } = await getRecommendedTools();
        setTools(tools);
        if (onDataLoaded) onDataLoaded(basedOnInterests);
      } catch (err) {
        console.log('err', err)
        setTools([]);
      } finally {
        setLoading(false);
      }
    };
    loadRecommended();
  }, [onDataLoaded]);

  if (loading) {
    return (
      <div className="loading-skeleton-row">
        {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card" />)}
      </div>
    );
  }

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