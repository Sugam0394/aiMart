 
import React, { useState, useEffect } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import "../css/ApprovedToolOwner.css";

function ApprovedToolOwners() {
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApproved = async () => {
    try {
      const res = await api.get("/toolowner-requests/approved");
      setApproved(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load approved ToolOwners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="custom-spinner"></div>
        <p>Syncing approved partners...</p>
      </div>
    );
  }

  return (
    <div className="approved-dashboard">
      <header className="page-header-alt">
        <div className="header-info">
          <h2 className="page-title">Verified ToolOwners</h2>
          <p className="subtitle">List of active partners managing AI tools</p>
        </div>
        <div className="stat-pill">Total: {approved.length}</div>
      </header>

      {approved.length === 0 ? (
        <div className="empty-state-card">
          <p>No verified owners found in the records.</p>
        </div>
      ) : (
        <div className="approved-grid-modern">
          {approved.map((req) => (
            <div className="verified-card" key={req._id}>
              <div className="card-top-accent"></div>
              
              <div className="verified-card-header">
                <h3 className="verified-tool-name">{req.toolName}</h3>
                <span className="trust-badge">Verified</span>
              </div>

              <div className="verified-card-body">
                <div className="data-row">
                  <label>Partner Email</label>
                  <span>{req.applicant?.email}</span>
                </div>
                <div className="data-row">
                  <label>Managed By</label>
                  <span className="admin-tag">{req.reviewedBy?.email || "System"}</span>
                </div>
              </div>

              <div className="verified-card-footer">
                <div className="approval-date">
                  <small>Member Since</small>
                  <span>
                    {new Date(req.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApprovedToolOwners;