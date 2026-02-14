import React from "react";
 import useTrendingForYou from "./useTrendingForYou";
 import ToolCard from "../../aiArt/components/ToolCard";
 
 import './TrendingForYou.css'

 

 
const ErrorState = ({ message, onRetry }) => (
  <div className="trending-error">
    <p>{message}</p>
    <button className="retry-btn" onClick={onRetry}>
      Retry
    </button>
  </div>
);


 const TrendingForYouSection = () => {
  const { tools, loading, error } = useTrendingForYou();

  if (loading) {
    return (
      <div className="usecase-row-container skeleton-active">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="tool-card-skeleton" />
        ))}
      </div>
    );
  }

  if (error) return <ErrorState message={error} />;
  
  // ✅ Empty state ki jagah hum null return karenge ya global trending dikhayenge
  // Kyuki humne backend fallback add kiya hai, ye khali nahi aayega.
  if (!tools || tools.length === 0) return null;

  return (
    <div className="usecase-row-container">
      {tools.map((tool) => (
        <ToolCard key={tool._id} tool={tool} />
      ))}
    </div>
  );
};


export default TrendingForYouSection;
