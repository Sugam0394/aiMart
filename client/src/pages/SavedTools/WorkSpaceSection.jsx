 import React from 'react';
import { Sparkles, Copy, Trash2 } from 'lucide-react'; // Trash2 added
import { useDispatch } from 'react-redux';
import { removePromptFromDB } from '../../app/features/SavedSlice';
import './WorkSpaceSection.css';

const WorkspaceSection = ({ prompts, onCopy }) => {
  const dispatch = useDispatch();
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
          {prompts.map((item, idx) => {
            // Check if it's a DB prompt (has .content) or an Explore prompt (has .prompts array)
            const isDbPrompt = !!item.content;

            return (
              <div key={item._id || idx} className="workspace-prompt-card">
                <div className="wp-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="wp-tool-info">
                    <Sparkles size={14} className="sparkle" />
                    <h3>{isDbPrompt ? (item.role || "Saved Prompt") : item.toolName}</h3>
                  </div>
                  
                  {/* Delete button only for DB prompts */}
                  {isDbPrompt && (
                    <button 
                      className="delete-prompt-btn" 
                      onClick={() => dispatch(removePromptFromDB(item._id))}
                      title="Remove from Workspace"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="wp-content">
                  {isDbPrompt ? (
                    /* Render DB Prompt Style */
                    <div className="wp-prompt-box">
                      <div className="wp-meta">
                        <label className="prompt-tag">{item.task || 'AI Task'}</label>
                        <button className="copy-mini-btn" onClick={() => onCopy(item.content)}>
                          <Copy size={12} /> Copy
                        </button>
                      </div>
                      <p className="wp-text">{item.content}</p>
                    </div>
                  ) : (
                    /* Render Explore Prompt Style (Nested Array) */
                    item.prompts.map((p, pIdx) => (
                      <div key={pIdx} className="wp-prompt-box">
                        <div className="wp-meta">
                          <label className="prompt-tag">{p.title}</label>
                          <button className="copy-mini-btn" onClick={() => onCopy(p.prompt)}>
                            <Copy size={12} /> Copy
                          </button>
                        </div>
                        <p className="wp-text">{p.prompt}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default WorkspaceSection;