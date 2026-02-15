import React, { useEffect, useState } from "react";
import { getRisingTools } from "../../../api/toolOwner/tool.services";
import "./RisingTools.css";
import ToolCard from '../../aiArt/components/ToolCard';
import ToolCardSkeleton from "../../aiArt/components/ToolCardSkeleton";

const RisingToolsSection = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTools = async () => {
      try {
        const data = await getRisingTools();
        setTools(data);
      } catch (err) {
        console.log('err', err)
        // Error handling service mein ho rahi hai
      } finally {
        setLoading(false);
      }
    };
    loadTools();
  }, []);

  if (loading) {
    return (
      <div className="usecase-row-container skeleton-active">
        {[1, 2, 3, 4].map((n) => (
           <ToolCardSkeleton key={n} />
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