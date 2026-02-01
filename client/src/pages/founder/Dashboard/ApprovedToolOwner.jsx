 
import React from "react";
import { useState , useEffect } from "react";
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
      toast.error(
        err.response?.data?.message || "Failed to load approved ToolOwners"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  if (loading) {
    return <div className="loader">Loading approved ToolOwners…</div>;
  }


  return (
  <div className="approved-dashboard">
      <h2 className="page-title">Approved ToolOwners</h2>

      {approved.length === 0 ? (
        <div className="empty-state">
          <p>No approved ToolOwners yet</p>
        </div>
      ) : (
        <div className="approved-grid">
          {approved.map((req) => (
            <div className="approved-card" key={req._id}>
              <div className="card-header">
                <span className="tool-name">{req.toolName}</span>
                <span className="status-badge approved">Approved</span>
              </div>

              <div className="card-body">
                <p>
                  <span>User</span>
                  <strong>{req.applicant?.email}</strong>
                </p>
                <p>
                  <span>Approved by</span>
                  <strong>{req.reviewedBy?.email}</strong>
                </p>
              </div>

              <div className="card-footer">
                <span>
                  {new Date(req.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  )
}

export default ApprovedToolOwners;
