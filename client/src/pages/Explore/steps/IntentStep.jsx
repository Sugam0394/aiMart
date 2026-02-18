import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { startExploreThunk, submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectExploreSessionId, selectExploreLoading } from '../../../app/exploreFeatures/exploreSelectors';
import "./styles/IntentStep.css";

function IntentStep() {
  const dispatch = useDispatch();
  const sessionId = useSelector(selectExploreSessionId);
  const isLoading = useSelector(selectExploreLoading);
  const [intent, setIntent] = useState("");

  const suggestions = ["Build a SaaS", "Study for exams", "Grow my business", "Design a Portfolio"];

  const handleSubmit = async () => {
    if (!intent.trim() || isLoading) return;

    try {
      let currentSessionId = sessionId;

      // AGAR SESSION NAHI HAI, TOH PEHLE START KARO (Just like before, but dynamic)
      if (!currentSessionId) {
        console.log("Starting session first...");
        const resultAction = await dispatch(startExploreThunk());
        
        // Thunk se nayi ID nikaalo
        if (startExploreThunk.fulfilled.match(resultAction)) {
          currentSessionId = resultAction.payload.sessionId;
        } else {
          alert("Failed to start session. Please try again.");
          return;
        }
      }

      // AB STEP SUBMIT KARO
      dispatch(submitExploreStepThunk({
        sessionId: currentSessionId,
        currentStep: "INTENT",
        stepData: { intent },
      }));

    } catch (err) {
      console.error("Flow Error:", err);
    }
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
            disabled={!intent.trim() || isLoading}
          >
            {isLoading ? "..." : "Go →"}
          </button>
        </div>
      </div>
      <div className="suggestions-container">
        <div className="suggestion-chips">
          {suggestions.map((s) => (
            <button key={s} className="chip" onClick={() => setIntent(s)}>{s}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IntentStep; 