 import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Copy, Share2, Sparkles } from "lucide-react";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectExploreSessionId, selectExploreLoading } from '../../../app/exploreFeatures/exploreSelectors';
import "./styles/ResultStep.css";

function ResultStep() {
  const dispatch = useDispatch();
  
  // Selectors for state management
  const { selections, prompts } = useSelector((state) => state.explore);
  const sessionId = useSelector(selectExploreSessionId);
  const isLoading = useSelector(selectExploreLoading);

  // BUG 1 FIX: Fetch prompts when component mounts
  useEffect(() => {
    if (sessionId && prompts.length === 0) {
      dispatch(submitExploreStepThunk({
        sessionId,
        currentStep: "RESULTS",
        stepData: {},
      }));
    }
  }, [dispatch, sessionId, prompts.length]);

  // BUG 3 FIX: Actual Clipboard Copy
  const handleShareStack = () => {
    const role = selections.role || 'general';
    const shareUrl = `${window.location.origin}/stack/${role}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert("Stack link copied! Share karo 🚀"))
      .catch(() => alert("Copy failed, manually copy karo: " + shareUrl));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Prompt copied to clipboard! 🚀");
  };

  // Loading state handling
  if (isLoading) {
    return (
      <div className="result-loading">
        <div className="spinner" />
        <p>Generating your AI prompts...</p>
      </div>
    );
  }

  return (
    <div className="result-step-premium">
      <div className="result-header">
        <div className="success-badge">
          <CheckCircle size={24} /> AI Stack Ready
        </div>
        <h1>Your Personalized Workflow</h1>
        <p>Expert-curated tools and prompts for a <b>{selections.role}</b> to master <b>{selections.task}</b>.</p>
      </div>

      <div className="prompts-grid">
        {prompts.map((item, idx) => (
          <div key={idx} className="prompt-card">
            <div className="tool-info">
              <Sparkles size={18} className="sparkle" />
              <h3>{item.toolName}</h3>
            </div>
            
            {item.prompts.map((p, pIdx) => (
              <div key={pIdx} className="prompt-box">
                <div className="prompt-meta">
                  <span>{p.title}</span>
                  <button onClick={() => copyToClipboard(p.prompt)}>
                    <Copy size={14} /> Copy
                  </button>
                </div>
                <p className="prompt-text">{p.prompt}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="result-actions">
        <button className="share-btn" onClick={handleShareStack}>
          <Share2 size={18} /> Share My Stack
        </button>
        <button className="finish-btn" onClick={() => window.location.href = '/'}>
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
}

export default ResultStep;