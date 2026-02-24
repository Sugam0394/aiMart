 import React from "react";
import { useSelector } from 'react-redux';
import "./RisingTools.css";
import ToolCard from '../../aiArt/components/ToolCard';
import ToolCardSkeleton from "../../aiArt/components/ToolCardSkeleton";

const RisingToolsSection = () => {
  // Redux store ka data use ho raha hai
  const tools = useSelector((state) => state.moment.risingTools);
  const loading = useSelector((state) => state.moment.homeStatus === 'loading');

  // local useState aur useEffect (API call) hata diya gaya hai
  if (loading) {
    return (
      <div className="usecase-row-container skeleton-active">
        {[1, 2, 3, 4].map((n) => (
           <ToolCardSkeleton key={n} />
        ))}
      </div>
    );
  }

  if (!tools || tools.length === 0) return null;

  return (
    <div className="usecase-row-container">
      {tools.map((tool) => (
        <ToolCard key={tool._id} tool={tool} />
      ))}
    </div>
  );
};

export default RisingToolsSection;