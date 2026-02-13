import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RisingTools.css";
import ToolCard from '../../aiArt/components/ToolCard'

const RisingToolsSection = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRising = async () => {
      try {
        const res = await axios.get("/api/risingTools");
        setTools(res.data.data || []);
      } catch (err) {
        console.error("Rising Tools fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRising();
  }, []);

  if (loading) {
    return (
      <div className="usecase-row-container skeleton-active">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="tool-card-skeleton" style={{ width: '280px', height: '180px', background: '#f0f0f0', borderRadius: '12px' }}></div>
        ))}
      </div>
    );
  }

  if (tools.length === 0) return null;

  return (
    <div className="usecase-row-container">
      {tools.map((tool) => (
        <ToolCard key={tool._id} tool={tool} />
      ))}
    </div>
  );
};

export default RisingToolsSection; 