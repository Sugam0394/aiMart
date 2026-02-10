import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import toast from 'react-hot-toast';
import "./FounderToolOwnerRequests.css";

function FounderToolOwnerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/toolowner-requests");
      setRequests(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      await api.patch(`/toolowner-requests/${requestId}`, { action });
      toast.success(`Request ${action}d successfully`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  if (loading) return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Fetching latest requests...</p>
    </div>
  );

  return (
    <div className="requests-container">
      <div className="section-header">
        <h2 className="page-title">ToolOwner Onboarding</h2>
        <span className="count-badge">{requests.length} Pending</span>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <p>All caught up! No pending requests.</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((req) => (
            <div className="request-card" key={req._id}>
              <div className="card-top">
                <div className="tool-info">
                  <h3 className="tool-name">{req.toolName}</h3>
                  <a href={req.website} target="_blank" rel="noreferrer" className="website-link">
                    {req.website || "No Website"} ↗
                  </a>
                </div>
                <span className="status-tag pending">Verification Required</span>
              </div>

              <div className="card-middle">
                <div className="info-row">
                  <span className="label">Applicant:</span>
                  <span className="value">{req.applicant?.email}</span>
                </div>
                <p className="description-text">{req.description}</p>
              </div>

              <div className="card-bottom">
                <div className="request-date">
                  Applied on: <strong>{new Date(req.createdAt).toLocaleDateString()}</strong>
                </div>
                <div className="action-group">
                  <button className="btn-action reject-btn" onClick={() => handleAction(req._id, "reject")}>
                    Decline
                  </button>
                  <button className="btn-action approve-btn" onClick={() => handleAction(req._id, "approve")}>
                    Approve Access
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FounderToolOwnerRequests; 