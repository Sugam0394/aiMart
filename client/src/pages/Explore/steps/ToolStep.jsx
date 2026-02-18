import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectStepPayload, selectExploreSessionId } from '../../../app/exploreFeatures/exploreSelectors';
import ToolCard from "../../aiArt/components/ToolCard";
import "./styles/ToolStep.css";

function ToolStep() {
  const dispatch = useDispatch();
  const sessionId = useSelector(selectExploreSessionId);
  const stepPayload = useSelector(selectStepPayload);
  const [selectedTools, setSelectedTools] = useState([]);

  const groups = [
    { 
      id: "bestMatch", 
      title: "🎯 Perfect Match", 
      desc: "AI-curated tools for your specific needs",
      data: stepPayload?.bestMatch || [] 
    },
    { 
      id: "trending", 
      title: "🔥 Popular Right Now", 
      desc: "What others are using for similar goals",
      data: stepPayload?.trending || [] 
    },
    { 
      id: "premium", 
      title: "💎 Professional Tier", 
      desc: "Premium tools for best results",
      data: stepPayload?.premium || [] 
    },
    { 
      id: "free", 
      title: "🎁 Free Options", 
      desc: "Zero cost, full value",
      data: stepPayload?.free || [] 
    }
  ];

  const handleToolToggle = (toolId) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleContinue = () => {
    dispatch(
      submitExploreStepThunk({
        sessionId,
        currentStep: "TOOLS",
        stepData: { toolIds: selectedTools },
      })
    );
  };

  const hasAnyData = groups.some(g => g.data.length > 0);

  if (!hasAnyData) {
    return (
      <div className="no-results-state">
        <div className="empty-icon">🔍</div>
        <h3>No tools found matching your criteria</h3>
        <p>Try adjusting your search or browse all tools.</p>
      </div>
    );
  }

  return (
    <div className="tool-step-premium">
      <div className="selection-header">
        <h2>Choose tools for your workspace</h2>
        <span className="selection-counter">
          {selectedTools.length} selected
        </span>
      </div>

      {groups.map((group) => (
        group.data.length > 0 && (
          <div key={group.id} className={`tool-group-wrapper ${group.id}`}>
            <div className="group-header">
              <div className="group-info">
                <h3 className="group-title">{group.title}</h3>
                <p className="group-subtitle">{group.desc}</p>
              </div>
              <span className="group-count">{group.data.length} tools</span>
            </div>
            
            {/* Horizontal Scroll Wrapper Added Here */}
            <div className="horizontal-scroll-container">
              {group.data.map((tool) => (
                <div 
                  key={tool._id} 
                  className={`horizontal-tool-item ${selectedTools.includes(tool._id) ? 'selected' : ''}`}
                  onClick={() => handleToolToggle(tool._id)}
                >
                  {group.id === 'bestMatch' && (
                    <div className="match-badge">
                      {tool.relevanceScore || 99}% Match
                    </div>
                  )}
                  
                  {selectedTools.includes(tool._id) && (
                    <div className="selection-checkmark">✓</div>
                  )}
                  
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      <div className="action-footer">
        <button 
          className="skip-btn"
          onClick={() => handleContinue()}
        >
          Skip for now
        </button>
        
    {  /*  <button
          className="primary-action-btn"
          onClick={handleContinue}
          disabled={selectedTools.length === 0}
        >
          Continue with {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} →
        </button> */ }
      </div>
    </div>
  );
}

export default ToolStep; 