 import React from "react";
import { useSelector } from 'react-redux';
import { Sparkles } from 'lucide-react'; // Ek icon add kiya for premium feel
import ToolCard from '../../aiArt/components/ToolCard';
import './Recommend.css';

const RecommendedSection = () => {
  const tools = useSelector((state) => state.moment.recommendedTools);
  const loading = useSelector((state) => state.moment.homeStatus === 'loading');

  if (loading) {
    return (
      <div className="recommend-wrapper">
        <div className="recommend-header-skeleton" />
        <div className="loading-skeleton-row">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      </div>
    );
  }

  if (!tools || tools.length === 0) return null;

  return (
    <section className="recommend-wrapper">
      {/* ── Section Header ── */}
      <div className="recommend-header">
        <div className="recommend-title-area">
          <div className="recommend-icon"><Sparkles size={18} /></div>
          <h2 className="recommend-label">Recommended for You</h2>
        </div>
        <button className="view-all-link">View all</button>
      </div>

      {/* ── Horizontal Scroll Row ── */}
      <div className="usecase-row-container">
        {tools.map((tool) => (
          <div key={tool._id} className="recommend-card-item">
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedSection;