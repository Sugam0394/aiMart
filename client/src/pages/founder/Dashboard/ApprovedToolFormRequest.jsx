import React, { useEffect, useState, useCallback } from 'react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';
import '../css/ApprovedToolFormRequest.css';

function ApprovedToolFormRequest() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🛡️ Safe Fetch: Callback use kiya hai memory leaks rokne ke liye
  const fetchApprovedTools = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/approvedTool");
      
      // Laptop vs Mobile data structure safety
      if (res.data && res.data.data) {
        setTools(res.data.data);
      } else {
        setTools([]);
      }
    } catch (err) {
      console.error("Fetch Error Detail:", err);
      const errorMsg = err.response?.data?.message || "Server connection failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedTools();
  }, [fetchApprovedTools]);

  // 🖼️ Image Error Handler: Prevents 404 infinite loops
  const handleImageError = (e) => {
    const fallback = "/default-logo.png";
    if (e.target.src !== window.location.origin + fallback) {
      e.target.src = fallback;
    }
  };

  if (loading) return (
    <div className="status-loading">
      <div className="loader-ring"></div>
      <p>Fetching published tools...</p>
    </div>
  );

  return (
    <div className="approved-section">
      <div className="section-header">
        <h2>Live Tools Directory</h2>
        <div className="live-indicator">
          <span className="blink-dot"></span>
          {tools.length} Tools Online
        </div>
      </div>

      {tools.length === 0 ? (
        <div className="empty-catalog">
          <p>No tools have been published yet.</p>
        </div>
      ) : (
        <div className="published-grid">
          {tools.map((tool) => (
            <div key={tool._id} className="published-tool-card">
              
              <div className="card-header-main">
                <img
                  src={tool.logo || "/default-logo.png"}
                  alt={tool.name}
                  className="mini-logo"
                  loading="lazy"
                  onError={handleImageError}
                />
                <div className="header-text">
                  <h3>{tool.name}</h3>
                  <span className="live-badge">LIVE</span>
                </div>
              </div>

              <div className="card-body-main">
                <p className="tool-tag">{tool.tagline || "No tagline available"}</p>
                
                <div className="meta-grid">
                  <div className="meta-box">
                    <label>Category</label>
                    <span>{tool.primaryCategory}</span>
                  </div>
                  <div className="meta-box">
                    <label>Owner</label>
                    <span className="owner-mail">{tool.createdBy?.email || "N/A"}</span>
                  </div>
                </div>

                <div className="intent-pills">
                  {tool.intentTags?.length > 0 ? (
                    tool.intentTags.map((tag, i) => (
                      <span key={i} className="pill">#{tag}</span>
                    ))
                  ) : (
                    <span className="pill-empty">No tags</span>
                  )}
                </div>
              </div>

              <div className="card-footer-main">
                <div className="date-info">
                  Published: {tool.updatedAt ? new Date(tool.updatedAt).toLocaleDateString() : "N/A"}
                </div>
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="view-link"
                >
                  Visit Tool ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div> 
  );
}

export default ApprovedToolFormRequest; 