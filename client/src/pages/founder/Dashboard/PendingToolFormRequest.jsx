import React from 'react'
import { useState, useEffect } from 'react'
import api from '../../../api/axios'
import toast from 'react-hot-toast'
import '../css/PendingToolFormRequest.css'

function PendingToolFormRequest() {


  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // toolId

 

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


 if (loading) {
    return (
      <div className="founder-dashboard-section">
        <h2>Pending Tools</h2>
        <p>Loading pending tools...</p>
      </div>
    );
  }




  return (
       <div className="founder-dashboard-section">
      <h2>Pending Tools</h2>

      {tools.length === 0 ? (
        <p className="empty-text">No pending tools 🎉</p>
      ) : (
        tools.map((tool) => (
          <div key={tool._id} className="request-card pending">
            {/* Header */}
            <div className="tool-header">
           <img
  src={tool.logo || "/default-logo.png"}
  alt={tool.name}
  className="tool-logo"
  onError={(e) => {
    e.target.src = "/default-logo.png";
  }}
/>


              <div className="tool-meta">
                <h3>{tool.name}</h3>
                {tool.tagline && <p className="tagline">{tool.tagline}</p>}
              </div>

              <span className="status-badge pending">PENDING</span>
            </div>

            <p className="description">{tool.description}</p>

            <p>
              <strong>Website:</strong>{" "}
              <a href={tool.url} target="_blank" rel="noreferrer">
                {tool.url}
              </a>
            </p>

            <p>
              <strong>Category:</strong> {tool.primaryCategory}
            </p>

            <p>
              <strong>Intent Tags:</strong>{" "}
              {tool.intentTags?.length ? tool.intentTags.join(", ") : "—"}
            </p>

            <p>
              <strong>Submitted By:</strong>{" "}
              {tool.createdBy?.email || "Unknown"}
            </p>

            <div className="action-buttons">
              <button
                className="btn approve"
                disabled={actionLoading === tool._id}
                onClick={() => handleAction(tool._id, "approve")}
              >
                {actionLoading === tool._id ? "Processing..." : "Approve"}
              </button>

              <button
                className="btn reject"
                disabled={actionLoading === tool._id}
                onClick={() => handleAction(tool._id, "reject")}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default PendingToolFormRequest