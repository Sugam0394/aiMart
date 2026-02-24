 import React from "react";
import { useSelector } from 'react-redux';
import ToolCard from '../../aiArt/components/ToolCard';
import './Recommend.css';

// onDataLoaded hata diya kyunki ab logic Redux handle kar raha hai
const RecommendedSection = () => {
  const tools = useSelector((state) => state.moment.recommendedTools);
  const loading = useSelector((state) => state.moment.homeStatus === 'loading');

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