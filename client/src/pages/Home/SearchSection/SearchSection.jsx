import React, { useState } from 'react';
import { useSearchTools } from './useSerachTools';
import ToolCard from '../../aiArt/components/ToolCard';
import './SearchSection.css';

const SearchSection = () => {
  const [term, setTerm] = useState('');
  const { tools, count, loading, error, search, clearSearch } = useSearchTools();
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
        handleSearchSubmit(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      // ✅ Clear search on Escape
      handleClear();
    }
  };

  const handleSearchSubmit = (value) => {
    setTerm(value);
    search(value);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setTerm('');
    clearSearch();
    setActiveIndex(-1);
  };

  // ✅ Sort: Featured first, then popular, then by rating
  const sortedTools = [...tools].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return b.isFeatured - a.isFeatured;
    if (a.isPopular !== b.isPopular) return b.isPopular - a.isPopular;
    return (b.avgRating || 0) - (a.avgRating || 0);
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
            onChange={(e) => {
              const value = e.target.value;
              setTerm(value);
              if (value.trim()) {
                search(value);
              } else {
                clearSearch();
              }
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
          />
          {/* ✅ Clear button */}
          {term && (
            <button className="clear-search-btn" onClick={handleClear}>
              ✕
            </button>
          )}
        </div>

        {/* Status Messages */}
        {loading && <div className="search-status">Searching tools...</div>}
        {error && <div className="search-status error">{error}</div>}

        {/* ✅ Show count */}
        {!loading && term && count > 0 && (
          <div className="search-count">
            Found {count} tool{count !== 1 ? 's' : ''}
          </div>
        )}

        {!loading && term && tools.length === 0 && (
          <div className="empty-state">
            <p className="empty-text">No tools found for "<strong>{term}</strong>"</p>
            <button className="empty-reset-btn" onClick={handleClear}>
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

        {/* Results Grid */}
     {/* Results Grid - Only show if term exists and results found */}
{term && sortedTools.length > 0 && (
  <div className="search-tools-row">
    {sortedTools.map(tool => (
      <ToolCard key={tool._id} tool={tool} />
    ))}
  </div>
)}

      </div>
    </section>
  );
};

export default SearchSection; 

