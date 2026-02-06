import React, { useEffect, useState } from 'react'
import api from '../../../api/axios'
import toast from 'react-hot-toast'
import '../css/ApprovedToolFormRequest.css'

function ApprovedToolFormRequest() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedTools = async () => {
    try {
      const res = await api.get("/approvedTool");
      setTools(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load approved tools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedTools();
  }, []);

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
                  onError={(e) => { e.target.src = "/default-logo.png"; }}
                />
                <div className="header-text">
                  <h3>{tool.name}</h3>
                  <span className="live-badge">LIVE</span>
                </div>
              </div>

              <div className="card-body-main">
                <p className="tool-tag">{tool.tagline}</p>
                
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
                  {tool.intentTags?.map((tag, i) => (
                    <span key={i} className="pill">#{tag}</span>
                  ))}
                </div>
              </div>

              <div className="card-footer-main">
                <div className="date-info">
                  Published: {new Date(tool.updatedAt).toLocaleDateString()}
                </div>
                <a href={tool.url} target="_blank" rel="noreferrer" className="view-link">
                  Visit Tool ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div> 
  )
}

export default ApprovedToolFormRequest; 