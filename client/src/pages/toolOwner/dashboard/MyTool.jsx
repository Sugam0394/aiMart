 import React, { useState, useEffect } from 'react';
import { getMyTools, deleteTool } from '../../../api/toolOwner/tool.services';
import { useNavigate } from 'react-router-dom';
import "../css/MyTool.css";

function MyTool() {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTools = async () => {
      try {
        const res = await getMyTools();
        if (res.data.success) setTools(res.data.tools);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchMyTools();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tool?")) return;
    try {
      await deleteTool(id);
      setTools((prev) => prev.filter((t) => t._id !== id));
    } catch { alert("Error deleting tool"); }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="inventory-wrapper">
      <div className="inventory-header">
        <h3>My Tool Repository</h3>
        <button className="create-btn-sm" onClick={() => navigate("/toolowner/dashboard/create-tool")}>
          + New Tool
        </button>
      </div>

      <div className="tools-grid-layout">
        {tools.map((tool) => (
          <div key={tool._id} className="inventory-card">
            {/* Status Badge ab hamesha card ke andar top-right rahega */}
            <div className={`badge-container ${tool.status}`}>
               {tool.status}
            </div>

            <div className="card-main">
              <div className="tool-icon-placeholder">{tool.name.charAt(0)}</div>
              <div className="tool-info">
                <h4>{tool.name}</h4>
                <p>{tool.primaryCategory}</p>
              </div>
            </div>

            <div className="card-footer">
              <button className="btn-edit" onClick={() => navigate(`/toolowner/dashboard/edit-tool/${tool._id}`)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(tool._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTool;