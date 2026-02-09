import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectExploreSessionId } from '../../../app/exploreFeatures/exploreSelectors';
import "./styles/IntentStep.css";

function IntentStep() {
  const dispatch = useDispatch();
  const sessionId = useSelector(selectExploreSessionId);
  const [intent, setIntent] = useState("");

  // Suggestions for better UX
  const suggestions = [
    "Build a SaaS", "Study for exams", "Grow my business", "Design a Portfolio"
  ];

  const handleSubmit = () => {
    if (!intent.trim()) return;
    dispatch(
      submitExploreStepThunk({
        sessionId,
        currentStep: "INTENT",
        stepData: { intent },
      })
    );
  };

  return (
    <div className="intent-step-premium">
      <div className="input-group">
        <label className="input-label">Describe your goal in a few words</label>
        <div className="glass-input-wrapper">
          <input
            type="text"
            className="premium-input"
            placeholder="e.g. Automate my marketing workflow"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button 
            className="continue-btn" 
            onClick={handleSubmit} 
            disabled={!intent.trim()}
          >
            Go →
          </button>
        </div>
      </div>

      <div className="suggestions-container">
        <span className="suggestion-hint">Popular goals:</span>
        <div className="suggestion-chips">
          {suggestions.map((s) => (
            <button 
              key={s} 
              className="chip" 
              onClick={() => setIntent(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IntentStep; 