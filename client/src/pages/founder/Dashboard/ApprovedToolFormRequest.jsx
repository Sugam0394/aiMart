import React from 'react'
import { useEffect, useState } from 'react'
import api from '../../../api/axios'
import toast from 'react-hot-toast'
import '../css/ApprovedToolFormRequest.css'

function ApprovedToolFormRequest() {

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch approved / live tools
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

  if (loading) return <p>Loading approved tools...</p>;



  return (
    <div className="founder-dashboard-section">
      <h2>Approved / Live Tools</h2>

      {tools.length === 0 ? (
        <p>No approved tools yet</p>
      ) : (
        tools.map((tool) => (
          <div key={tool._id} className="request-card approved">
            
            {/* 🔹 Logo + Name */}
            <div className="tool-header">
              <img
                src={tool.logo}
                alt={tool.name}
                className="tool-logo"
              />
              <div>
                <h3>{tool.name}</h3>
                <p className="tagline">{tool.tagline}</p>
              </div>
            </div>

            <p className="description">{tool.description}</p>

            <p>
              <strong>Website:</strong>{" "}
              <a href={tool.url} target="_blank" rel="noreferrer">
                {tool.url}
              </a>
            </p>

            <p><strong>Primary Category:</strong> {tool.primaryCategory}</p>
            <p><strong>Intent Tags:</strong> {tool.intentTags.join(", ")}</p>

            <p>
              <strong>Tool Owner:</strong>{" "}
              {tool.createdBy?.email || "N/A"}
            </p>

            <p>
              <strong>Approved On:</strong>{" "}
              {new Date(tool.updatedAt).toLocaleString()}
            </p>

            <span className={`status-badge ${tool.status}`}>
              {tool.status.toUpperCase()}
            </span>
          </div>
        ))
      )}
    </div> 
  )
}

export default ApprovedToolFormRequest