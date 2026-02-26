 import React from 'react';
import ToolCard from '../aiArt/components/ToolCard';
import { Briefcase, ChevronRight } from 'lucide-react';
import './InventorySection.css';

const InventorySection = ({ items, onExploreMore }) => {
  return (
    <section className="inventory-section">
      <div className="section-header-flex">
        <h2><Briefcase size={20} /> My Tool Stack</h2>
        <button onClick={onExploreMore} className="explore-more-btn">
          Explore More <ChevronRight size={16}/>
        </button>
      </div>
      
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
          <h2>Your inventory is empty</h2>
          <button onClick={onExploreMore} className="saas-btn-primary">
            Discover Tools
          </button>
        </div>
      )}
    </section>
  );
};

export default InventorySection;