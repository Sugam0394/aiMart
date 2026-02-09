import React, { useState } from 'react';
import { useSearchTools } from './useSerachTools';
import ToolCard from '../../aiArt/components/ToolCard';
import './SearchSection.css';

const SearchSection = () => {
  const [term, setTerm] = useState('');
  const { tools, loading, error, search } = useSearchTools();
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = tools.length > 0
    ? [...new Set(tools.flatMap(tool => tool.intentTags || []))].slice(0, 5)
    : [];

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === -1 ? suggestions.length - 1 : (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        const selected = suggestions[activeIndex];
        handleSearchSubmit(selected);
      }
    }
  };

  const handleSearchSubmit = (value) => {
    setTerm(value);
    search(value);
    setActiveIndex(-1);
  };

  const sortedTools = [...tools].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  return (
    <section className="search-section-wrapper">
      <div className="search-section-container">
        
        {/* Search Input Box */}
        <div className="search-controls">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Search AI tools for your next big project..."
            value={term}
            onChange={e => {
              const value = e.target.value;
              setTerm(value);
              search(value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Status Messages */}
        {loading && <div className="search-status">Searching tools...</div>}
        {error && <div className="search-status error">Error: Try again later.</div>}

        {!loading && term && tools.length === 0 && (
          <div className="empty-state">
            <p className="empty-text">No tools found for "<strong>{term}</strong>"</p>
            <button className="empty-reset-btn" onClick={() => handleSearchSubmit('')}>
              Clear Search
            </button>
          </div>
        )}

        {/* Suggestions Pills */}
        {term && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((tag, idx) => (
              <span
                key={tag}
                className={`suggestion-pill ${idx === activeIndex ? "active" : ""}`}
                onClick={() => handleSearchSubmit(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Results Grid - Consistent with Home Layout */}
        <div className="tool-cards-grid">
          {sortedTools.map(tool => (
            <ToolCard key={tool.id || tool._id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchSection; 

