import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';
import '../css/PendingToolFormRequest.css';

function PendingToolFormRequest() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPendingTools = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pendingTool");
      setTools(res?.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load tools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTools();
  }, []);

  const handleAction = async (toolId, action) => {
    try {
      setActionLoading(toolId);
      if (action === "approve") {
        await api.patch(`/approve/${toolId}`);
      } else if (action === "reject") {
        await api.patch(`/reject/${toolId}`);
      }
      toast.success(`Tool ${action}ed successfully`);
      fetchPendingTools();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="skeleton-loader">
      <div className="spinner-ring"></div>
      <p>Verifying pending submissions...</p>
    </div>
  );

  return (
    <div className="founder-section">
      <div className="section-header">
        <h2>Pending Tool Submissions</h2>
        <span className="badge-count">{tools.length} Waiting</span>
      </div>

      {tools.length === 0 ? (
        <div className="empty-box">
          <p>No pending tools 🎉 Everything is up to date!</p>
        </div>
      ) : (
        <div className="tool-requests-list">
          {tools.map((tool) => (
            <div key={tool._id} className="modern-tool-card">
              <div className="card-top">
                <div className="tool-brand">
                  <img
                    src={tool.logo || "/default-logo.png"}
                    alt={tool.name}
                    className="tool-logo-img"
                    onError={(e) => { e.target.src = "/default-logo.png"; }}
                  />
                  <div className="tool-meta-info">
                    <h3>{tool.name}</h3>
                    <p className="tool-tagline">{tool.tagline || "No tagline provided"}</p>
                  </div>
                </div>
                <div className="category-pill">{tool.primaryCategory}</div>
              </div>

              <div className="card-mid">
                <p className="tool-desc">{tool.description}</p>
                
                <div className="info-grid">
                  <div className="info-item">
                    <label>Website</label>
                    <a href={tool.url} target="_blank" rel="noreferrer">{tool.url}</a>
                  </div>
                  <div className="info-item">
                    <label>Submitted By</label>
                    <span>{tool.createdBy?.email || "Unknown"}</span>
                  </div>
                </div>

                <div className="tags-container">
                  {tool.intentTags?.map((tag, index) => (
                    <span key={index} className="intent-tag">#{tag}</span>
                  ))}
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn-outline-reject"
                  disabled={actionLoading === tool._id}
                  onClick={() => handleAction(tool._id, "reject")}
                >
                  {actionLoading === tool._id ? "..." : "Reject Submission"}
                </button>
                <button
                  className="btn-solid-approve"
                  disabled={actionLoading === tool._id}
                  onClick={() => handleAction(tool._id, "approve")}
                >
                  {actionLoading === tool._id ? "Processing..." : "Approve & Publish"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingToolFormRequest; 