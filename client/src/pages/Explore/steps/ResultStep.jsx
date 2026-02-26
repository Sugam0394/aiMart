 import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, Share2, Sparkles, LayoutDashboard, ArrowRight } from "lucide-react";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectExploreSessionId, selectExploreLoading } from '../../../app/exploreFeatures/exploreSelectors';
import "./styles/ResultStep.css";

function ResultStep() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { selections, prompts } = useSelector((state) => state.explore);
  const sessionId = useSelector(selectExploreSessionId);
  const isLoading = useSelector(selectExploreLoading);

  useEffect(() => {
    if (sessionId && prompts.length === 0) {
      dispatch(submitExploreStepThunk({
        sessionId,
        currentStep: "RESULTS",
        stepData: {},
      }));
    }
  }, [dispatch, sessionId, prompts.length]);

  const handleShareStack = () => {
    const role = selections.role || 'general';
    const shareUrl = `${window.location.origin}/stack/${role}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert("Stack link copied! Share karo 🚀"))
      .catch(() => alert("Copy failed: " + shareUrl));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Prompt copied to clipboard! 🚀");
  };

  if (isLoading) {
    return (
      <div className="result-loading">
        <div className="spinner-glow" />
        <p>Architecting your custom AI workflow...</p>
      </div>
    );
  }

  return (
    <div className="result-step-premium">
      {/* Launchpad Header */}
      <div className="result-header">
        <div className="success-badge">
          <CheckCircle size={20} /> Selection Saved to Inventory
        </div>
        <h1>Your AI Power-Stack is Ready</h1>
        <p>We've curated these specialized prompts for a <b>{selections.role}</b> to master <b>{selections.task}</b>.</p>
      </div>

      {/* Prompts Display */}
      <div className="prompts-grid">
        {prompts.map((item, idx) => (
          <div key={idx} className="prompt-card">
            <div className="tool-info">
              <div className="tool-icon-mini">
                <Sparkles size={16} />
              </div>
              <h3>{item.toolName}</h3>
            </div>
            
            {item.prompts.map((p, pIdx) => (
              <div key={pIdx} className="prompt-box">
                <div className="prompt-meta">
                  <span className="prompt-tag">{p.title}</span>
                  <button className="copy-mini-btn" onClick={() => copyToClipboard(p.prompt)}>
                    <Copy size={12} /> Copy
                  </button>
                </div>
                <p className="prompt-text">{p.prompt}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Persistent CTA Footer */}
      <div className="result-actions-container">
        <div className="action-card-hint">
          <p>All selected tools are now available in your permanent <b>Inventory</b>.</p>
        </div>
        <div className="result-buttons-group">
          <button className="share-secondary-btn" onClick={handleShareStack}>
            <Share2 size={18} /> Share Stack
          </button>
           // ✅ NAYA CODE (Isse replace karo):
<button className="finish-primary-btn" onClick={() => navigate('/saved')}>
  Go to My Inventory <ArrowRight size={18} />
</button>
        </div>
      </div>
    </div>
  );
}

export default ResultStep;