 import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, Copy, Share2, Sparkles } from "lucide-react";
import "./styles/ResultStep.css";

function ResultStep() {
  // Redux se data nikaalo jo processStep ke RESULTS case se aaya tha
  const { selections, prompts } = useSelector((state) => state.explore);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Prompt copied to clipboard! 🚀");
  };

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
        <button className="share-btn" onClick={() => alert("Link copied to share!")}>
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