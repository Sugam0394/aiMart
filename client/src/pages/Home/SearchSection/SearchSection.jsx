 import React, { useState } from 'react';
import { useSearchTools } from './useSerachTools';
import ToolCard from '../../aiArt/components/ToolCard';
import './SearchSection.css';

const SearchSection = () => {
  const [term, setTerm] = useState('');
  const { tools, loading, error, search } = useSearchTools();
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);



 React.useEffect(() => {
  const tags = tools.flatMap(tool => tool.intentTags || []);
  setSuggestions([...new Set(tags)].slice(0, 5));
}, [tools]);



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
      setTerm(selected);
      search(selected);
      setActiveIndex(-1);
    }
  }
};



const sortedTools = [...tools].sort((a, b) => {
  if (a.isFeatured && !b.isFeatured) return -1;
  if (!a.isFeatured && b.isFeatured) return 1;

  if (a.isPopular && !b.isPopular) return -1;
  if (!a.isPopular && b.isPopular) return 1;

  return 0; // keep original order for others
});












  return (
    <section className="search-section-wrapper">
      <div className="search-section-container">

        {/* Search Bar */}
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search AI tools"
            value={term}
            onChange={e => {
              const value = e.target.value;
              setTerm(value);
              search(value); // real-time, debounced
              setActiveIndex(-1); // reset active index on input change
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
      {/* Status */}
{!loading && term && tools.length === 0 && (
  <div className="empty-state">
    <img
      src="/assets/empty-search.svg" // koi lightweight svg / png
      alt="No tools found"
      className="empty-image"
    />
    <p className="empty-text">No tools found for "{term}"</p>
    <button
      className="empty-reset-btn"
      onClick={() => setTerm('')}
    >
      Reset Search
    </button>
  </div>
)}
{loading && (
  <div className="loading-state">
    <p>Loading tools...</p>

  </div>)}
{error && (
  <div className="error-state">
    <p>Error loading tools. Please try again later.</p>
  </div>
)}

        {/* Suggestions */}
         {term && suggestions.length > 0 && (
  <div className="search-suggestions">
  {suggestions.map((tag, idx) => (
    <span
      key={tag}
      className={idx === activeIndex ? "active-suggestion" : ""}
      onClick={() => {
        setTerm(tag);
        search(tag);
      }}
    >
      {tag}
    </span>
  ))}
</div>

)}

        {/* Tool Cards */}
        <div className="tool-cards-grid">
          {sortedTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} searchTerm={term} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchSection;

