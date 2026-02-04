 import React from "react";
import { useSelector } from "react-redux";
import { selectStepPayload } from '../../../app/exploreFeatures/exploreSelectors';
import ToolCard from "../../aiArt/components/ToolCard";

import "./styles/ToolStep.css";

function ToolStep() {
  const stepPayload = useSelector(selectStepPayload);

  // Payload normalization: direct array ya object wrapper
  const tools = Array.isArray(stepPayload) ? stepPayload : (stepPayload?.tools || []);

  return (
    <div className="tool-step-container">
      <div className="step-header">
        <h2>Recommended Tools for You</h2>
        <p>Click on any tool to explore its features.</p>
      </div>

      {tools.length === 0 ? (
        <div className="no-data">
          <p>No tools found for this selection.</p>
        </div>
      ) : (
        <div className="tool-grid">
          {tools.map((tool) => (
            <div key={tool._id} className="tool-item">
              {/* Seedha ToolCard use karo, isme navigate pehle se hi hai */}
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      )}
      
      {/* Footer ki zarurat nahi agar user direct click karke ja raha hai */}
    </div>
  );
}

export default ToolStep; 