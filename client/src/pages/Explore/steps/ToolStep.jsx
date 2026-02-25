 import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectStepPayload, selectExploreSessionId } from '../../../app/exploreFeatures/exploreSelectors';
import ToolCard from "../../aiArt/components/ToolCard";
import "./styles/ToolStep.css";

function ToolStep() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionId = useSelector(selectExploreSessionId);
  const stepPayload = useSelector(selectStepPayload);
  const [selectedTools, setSelectedTools] = useState([]);

  const groups = [
    { id: "bestMatch", title: "🎯 Perfect Match", desc: "AI-curated tools for your specific needs", data: stepPayload?.bestMatch || [] },
    { id: "trending", title: "🔥 Popular Right Now", desc: "What others are using for similar goals", data: stepPayload?.trending || [] },
    { id: "premium", title: "💎 Professional Tier", desc: "Premium tools for best results", data: stepPayload?.premium || [] },
    { id: "free", title: "🎁 Free Options", desc: "Zero cost, full value", data: stepPayload?.free || [] }
  ];

  const handleToolToggle = (toolId) => {
    setSelectedTools(prev => 
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  };

 
const handleContinue = async () => {
  try {
   
    await dispatch(
      submitExploreStepThunk({
        sessionId,
        currentStep: "TOOLS",
        stepData: { toolIds: selectedTools },
      })
    ).unwrap();

  
    navigate('/saved');
  } catch (err) {
    console.error("Failed to save tools:", err);
    alert("Something went wrong, please try again.");
  }
};

  const hasAnyData = groups.some(g => g.data.length > 0);
  if (!hasAnyData) return <div className="no-results-state"><h3>No tools found matching your criteria</h3></div>;

  return (
    <div className="tool-step-premium">
      <div className="selection-header">
        <h2>Choose tools for your workspace</h2>
        <span className="selection-counter">{selectedTools.length} selected</span>
      </div>

      {groups.map((group) => group.data.length > 0 && (
        <div key={group.id} className="tool-group-wrapper">
          <div className="group-header">
            <div className="group-info">
              <h3 className="group-title">{group.title}</h3>
              <p className="group-subtitle">{group.desc}</p>
            </div>
          </div>
          
          <div className="horizontal-scroll-container">
            {group.data.map((tool) => {
              const isSelected = selectedTools.includes(tool._id);
              return (
                <div 
                  key={tool._id} 
                  className={`horizontal-tool-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleToolToggle(tool._id)}
                >
                  {/* Selection Pill */}
                  <div className={`selection-pill ${isSelected ? 'active' : ''}`}>
                    {isSelected ? "✓ Selected" : "+ Add"}
                  </div>

                  {group.id === 'bestMatch' && (
                    <div className="match-badge">{tool.relevanceScore || 99}% Match</div>
                  )}

                  <div className="card-selection-wrapper">
                    <ToolCard tool={tool} />
                  </div>

                  <div className="tool-card-footer">
                    <button 
                      className="text-view-btn"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        navigate(`/tools/${tool._id}`);
                      }}
                    >
                      Read Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="action-footer">
        <button className="cta-main-btn" onClick={handleContinue}>
          {selectedTools.length === 0 ? 'Skip for now' : `Add ${selectedTools.length} tools to Workspace →`}
        </button>
      </div>
    </div>
  );
}

export default ToolStep;