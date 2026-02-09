import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ToolCard from '../../pages/aiArt/components/ToolCard'; 
import './SavedTools.css';

const SavedTools = () => {
  const { items, status } = useSelector((state) => state.saved);

  if (status === 'loading') {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Fetching your curated collection...</p>
      </div>
    );
  }

  return (
    <div className="saved-page-wrapper">
      <header className="saved-hero">
        <div className="hero-content">
          <span className="badge">Personal Library</span>
          <h1>My Inventory <span className="heart-icon">❤️</span></h1>
          <p>Managed <strong>{items.length}</strong> professional tools in your workspace.</p>
        </div>
      </header>

      <main className="saved-container">
        {items.length > 0 ? (
          <div className="premium-grid">
            {items.map((tool) => (
              <div className="grid-item-reveal" key={tool._id}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-workspace">
            <div className="glass-icon">📂</div>
            <h2>Your workspace is empty</h2>
            <p>Start building your AI stack by exploring the latest tools.</p>
            <Link to="/explore" className="saas-btn-primary">
              Discover Tools
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedTools; 