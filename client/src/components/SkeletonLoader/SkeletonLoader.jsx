import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="saved-page-wrapper" style={{ background: 'var(--bg-main)', padding: '40px 20px' }}>
      <div className="saved-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Skeleton */}
        <div className="skeleton-hero" style={{ height: '150px', background: '#e2e8f0', borderRadius: '16px', marginBottom: '40px', animation: 'pulse 1.5s infinite' }}></div>
        
        {/* Grid Skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ height: '300px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '15px' }}>
              <div style={{ height: '160px', background: '#f1f5f9', borderRadius: '8px', marginBottom: '15px', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ height: '20px', background: '#f1f5f9', width: '70%', marginBottom: '10px', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ height: '15px', background: '#f1f5f9', width: '40%', animation: 'pulse 1.5s infinite' }}></div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SkeletonLoader;