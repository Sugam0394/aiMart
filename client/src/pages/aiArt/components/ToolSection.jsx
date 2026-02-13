import { useEffect, useState } from "react";
 import { fetchPublicTools } from "../../../api/toolOwner/tool.services";
import ToolGrid from "./ToolGrid";
import './ToolSection.css'

function ToolSection() {

 

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTools = async () => {
      try {
        const data = await fetchPublicTools();
       
        setTools(data);
      } catch (err) {
        console.error("Failed to load tools", err);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);
   
  if (loading) return <p className="tool-section-loading">Loading tools...</p>;
  if (!loading && tools.length === 0) return <p className="empty-text">No tools found</p>;

  return (
     <div className="tool-section">
    <h2>Popular Tools</h2>
    
    {loading ? (
      <div className="tool-section-loading">
        <div className="spinner"></div> {/* Spinner add kar sakte ho */}
        <p>Loading your tools...</p>
      </div>
    ) : tools.length === 0 ? (
      <p className="empty-text">No tools found</p>
    ) : (
      <ToolGrid tools={tools} />
    )}
  </div>

  )
}

export default ToolSection;
