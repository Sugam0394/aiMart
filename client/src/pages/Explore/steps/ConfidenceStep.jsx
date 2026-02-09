import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import {  selectExploreSessionId  } from '../../../app/exploreFeatures/exploreSelectors';
import "./styles/ConfidenceStep.css";





 
function ConfidenceStep() {
  const dispatch = useDispatch();
  const sessionId = useSelector(selectExploreSessionId);
  const selections = useSelector((state) => state.explore.selections); // ✅ Use Redux selections
 

  const handleConfirm = () => {
    dispatch(
      submitExploreStepThunk({
        sessionId,
        currentStep: "CONFIDENCE",
        stepData: { confidenceScore: 5 },
      })
    );
  };

  return (
    <div className="confidence-step-premium">
      <div className="success-animation">
        <div className="check-ring"></div>
        <span className="rocket-emoji">🚀</span>
      </div>

      <h2 className="final-title">Your AI Workspace is Ready!</h2>
      <p className="final-subtitle">
        We've handpicked {selections.tools?.length || 0} tools based on your journey
      </p>

      <div className="summary-grid">
        <div className="summary-card">
          <span className="summary-label">Your Goal</span>
          <span className="summary-value">
            {selections.intent || "Not specified"}
          </span>
        </div>
        
        <div className="summary-card">
          <span className="summary-label">Focus Area</span>
          <span className="summary-value">
            {selections.useCase?.replace(/-/g, ' ') || "General"}
          </span>
        </div>
        
        <div className="summary-card">
          <span className="summary-label">Tools Selected</span>
          <span className="summary-value">
            {selections.tools?.length || 0} tools
          </span>
        </div>
      </div>

      <button className="final-confirm-btn" onClick={handleConfirm}>
        Launch My Workspace
        <span className="btn-arrow">→</span>
      </button>
      
      <p className="footer-note">
        💡 You can always re-run this wizard from Settings
      </p>
    </div>
  );
}

export default ConfidenceStep; 