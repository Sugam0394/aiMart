 import React from 'react';
import { Sparkles, Copy } from 'lucide-react';

const WorkspaceSection = ({ prompts, onCopy }) => {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="workspace-wrapper">
      <div className="workspace-separator">
        <span>Personal AI Workspace</span>
      </div>

      <section className="workspace-section">
        <div className="section-header-flex">
          <h2><Sparkles size={20} className="ai-icon" /> Active Workflows</h2>
          <span className="live-badge">Ready to use</span>
        </div>
        
        <div className="workspace-prompts-grid">
          {prompts.map((item, idx) => (
            <div key={idx} className="workspace-prompt-card">
              <div className="wp-card-header">
                <div className="wp-tool-info">
                  <Sparkles size={14} className="sparkle" />
                  <h3>{item.toolName}</h3>
                </div>
              </div>
              <div className="wp-content">
                {item.prompts.map((p, pIdx) => (
                  <div key={pIdx} className="wp-prompt-box">
                    <div className="wp-meta">
                      <label className="prompt-tag">{p.title}</label>
                      <button className="copy-mini-btn" onClick={() => onCopy(p.prompt)}>
                        <Copy size={12} /> Copy
                      </button>
                    </div>
                    <p className="wp-text">{p.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WorkspaceSection;