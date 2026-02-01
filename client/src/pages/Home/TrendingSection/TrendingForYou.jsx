import React from "react";
 import useTrendingForYou from "./useTrendingForYou";
 import ToolGrid from "../../aiArt/components/ToolGrid";
 
 import './TrendingForYou.css'


 const EmptyState = () => (
  <div className="trending-empty">
    <p>No trending tools found for your current intent.</p>
  </div>
);

 
const ErrorState = ({ message, onRetry }) => (
  <div className="trending-error">
    <p>{message}</p>
    <button className="retry-btn" onClick={onRetry}>
      Retry
    </button>
  </div>
);

 
const SkeletonCard = () => (
  <div className="skeleton-card"></div>
);




const TrendingForYouSection = () => {
    const { tools, loading, error } = useTrendingForYou();

  const handleRetry = () => {
    // Future-proof: if hook supports refetch, call here
    window.location.reload(); // simple fallback for now
  };

  if (loading) {
    return (
      <div className="skeleton-grid">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <SkeletonCard key={i} />
          ))}
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={handleRetry} />;
  
  if (!tools || tools.length === 0) return <EmptyState />;

  return <ToolGrid tools={tools} />;
};

export default TrendingForYouSection;
