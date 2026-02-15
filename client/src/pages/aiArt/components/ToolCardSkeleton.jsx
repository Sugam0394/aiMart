import "./ToolCard.css"; // Hum purani CSS hi reuse karenge aur kuch skeleton specific classes add karenge

function ToolCardSkeleton() {
  return (
    <div className="tool-card skeleton-card">
      <div className="tool-card-image skeleton-shimmer">
        {/* Placeholder for image/gradient */}
        <div className="skeleton-image"></div>
      </div>

      <div className="tool-card-footer">
        <div className="footer-top">
          {/* Placeholder for category badge */}
          <div className="skeleton-text skeleton-badge skeleton-shimmer"></div>
        </div>

        {/* Placeholder for Title */}
        <div className="skeleton-text skeleton-title skeleton-shimmer"></div>
        
        <div className="footer-bottom">
          {/* Placeholder for pricing tag */}
          <div className="skeleton-text skeleton-price skeleton-shimmer"></div>
          {/* Placeholder for Detail link */}
          <div className="skeleton-text skeleton-link skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  );
}

export default ToolCardSkeleton;