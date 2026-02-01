import React from 'react'
import { useState, useEffect } from 'react'
import { getMyTools } from '../../../api/toolOwner/tool.services'
import { deleteTool } from '../../../api/toolOwner/tool.services'
import { useNavigate } from 'react-router-dom'
 
 import "../css/MyTool.css"

function MyTool() {

  const navigate = useNavigate();

 const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    const fetchMyTools = async () => {
      try {
        const res = await getMyTools();
        if (res.data.success) {
          setTools(res.data.tools);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTools();
  }, []);

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this tool?"
  );

  if (!confirmDelete) return;

  try {
    await deleteTool(id);

    // UI se tool remove (NO refetch needed)
    setTools((prev) => prev.filter((tool) => tool._id !== id));
  } catch (err) {
    console.error(err);
    alert("Failed to delete tool");
  }
};


  if (loading) return <p>Loading tools...</p>;

   return (
  <div className="my-tools">
    <h2>My Tools</h2>

    {tools.length === 0 && <p>No tools submitted yet.</p>}

    {tools.map((tool) => (
      <div key={tool._id} className="tool-card">
        {/* LEFT */}
        <div>
          <h4>{tool.name}</h4>
          <p className="category">{tool.primaryCategory}</p>
        </div>

        {/* RIGHT */}
        <div className="right-section">
          <div className={`status ${tool.status}`}>
            {tool.status}
          </div>

          {tool.status === "live" && (
            <>
             <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/toolowner/dashboard/edit-Tool/${tool._id}`)
                  }
                >
                  Edit
                </button>

             <button
        className="delete-btn"
        onClick={() => handleDelete(tool._id)}
      >
        Delete
      </button>
      </>
          )}
        </div>
      </div>
    ))}
  </div>
  );

}

export default MyTool