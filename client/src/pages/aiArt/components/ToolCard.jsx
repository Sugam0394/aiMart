import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveTool } from "../../../app/features/SavedSlice"; 
import "./ToolCard.css";

function ToolCard({ tool }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selector to check if this specific tool is in the saved list
  const isSaved = useSelector((state) => 
    state.saved.savedIds.includes(tool._id)
  );

  const handleHeartClick = (e) => {
    e.stopPropagation(); // Card navigation rokne ke liye
    
    // 🔥 FIX: Pura 'tool' object bhej rahe hain taaki Saved page turant update ho jaye
    dispatch(toggleSaveTool(tool)); 
  };

  return (
    <div className="tool-card" onClick={() => navigate(`/tools/${tool._id}`)}>
      <div className="tool-card-image">
        <img 
          src={tool.logo || "/assets/placeholder.png"} 
          alt={tool.name} 
          loading="lazy" 
        />
        
        {/* Heart Icon Button */}
        <button 
          className={`card-heart-btn ${isSaved ? "active" : ""}`} 
          onClick={handleHeartClick}
          aria-label={isSaved ? "Unsave Tool" : "Save Tool"}
        >
          {isSaved ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="tool-card-footer">
        <div className="footer-top">
          <span className="tool-category-mini">
            {tool.primaryCategory || "AI Tool"}
          </span>
          {/* Agar tool verified hai toh chota badge dikha sakte ho */}
          {tool.status === "live" && <span className="verified-dot"></span>}
        </div>

        <h4 className="tool-name">{tool.name}</h4>
        
        <div className="footer-bottom">
           <span className={`pricing-tag ${tool.pricingType?.toLowerCase()}`}>
             {tool.pricingType || "Free"}
           </span>
           <span className="tool-view">Detail →</span>
        </div>
      </div>
    </div>
  );
}

export default ToolCard; 

