import React, {useEffect, useState} from "react";
import api from "../../../api/axios";
import toast from 'react-hot-toast'
 import "../css/FounderToolOwnerRequests.css"

 

function FounderToolOwnerRequests() {

 const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);


  // 1️⃣ Fetch pending requests
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

  // 2️⃣ Approve / Reject handler
  const handleAction = async (requestId, action) => {
    try {
      await api.patch(`/toolowner-requests/${requestId}`, {
        action, // "approve" | "reject"
      });

      toast.success(`Request ${action}d successfully`);
      fetchRequests(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };


  if (loading) return <p>Loading requests...</p>;









  return (
  <div className="founder-dashboard">
    <h2 className="page-title">Pending ToolOwner Requests</h2>

    {requests.length === 0 ? (
      <p className="empty-text">No pending requests</p>
    ) : (
      <div className="requests-grid">
        {requests.map((req) => (
          <div className="request-card" key={req._id}>
            
            <div className="card-header">
              <span className="tool-name">{req.toolName}</span>
              <span className="status-badge pending">Pending</span>
            </div>

            <div className="card-body">
              <p><strong>User:</strong> {req.applicant?.email}</p>
              <p><strong>Website:</strong> {req.website || "N/A"}</p>
              <p className="description">{req.description}</p>
            </div>

            <div className="card-footer">
              <span className="date">
                {new Date(req.createdAt).toLocaleDateString()}
              </span>

              <div className="actions">
                <button
                  className="btn approve"
                  onClick={() => handleAction(req._id, "approve")}
                >
                  Approve
                </button>

                <button
                  className="btn reject"
                  onClick={() => handleAction(req._id, "reject")}
                >
                  Reject
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    )}
  </div>
     
          
   
   
     
  )
}

export default FounderToolOwnerRequests