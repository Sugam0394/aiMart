 import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-container">
        {/* Always show hero for full page loading */}
        <div className="skeleton-box skeleton-hero"></div>
        
        <div className="skeleton-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-box skeleton-img"></div>
              <div className="skeleton-box skeleton-title"></div>
              <div className="skeleton-box skeleton-text"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;