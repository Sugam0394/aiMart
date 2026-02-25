 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveTool } from "../../../app/features/SavedSlice";
import "./ToolCard.css";

function ToolCard({ tool }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isSaved = useSelector((state) => 
    state.saved.savedIds.includes(tool._id)
  );

  const handleHeartClick = (e) => {
    e.stopPropagation();
    dispatch(toggleSaveTool(tool));
  };

  const gradientsByCategory = {
    content: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    code: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    design: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    business: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    audio: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    video: "linear-gradient(135deg, #ffd89b 0%, #19547b 100%)",
    ai: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  };

  const getGradient = () => gradientsByCategory[tool.primaryCategory] || gradientsByCategory.ai;
  const shouldShowFallback = imageError || !tool.logo;

  return (
    <div className="tool-card" onClick={() => navigate(`/tools/${tool._id}`)}>
      <div className="tool-card-image">
        {shouldShowFallback ? (
          <div className="tool-gradient-placeholder" style={{ background: getGradient() }}>
            <div className="gradient-overlay"></div>
            <span className="tool-initial">
              {tool.name?.charAt(0).toUpperCase() || "?"}
            </span>
            <span className="tool-category-badge">
              {tool.primaryCategory || "AI"}
            </span>
          </div>
        ) : (
          <>
            {!isLoaded && (
              <div className="tool-gradient-placeholder absolute-fill" style={{ background: getGradient() }}>
                <span className="tool-initial-mini">
                   {tool.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <img 
              src={tool.logo} 
              alt={tool.name}
              className={`tool-logo-img ${isLoaded ? "loaded" : "loading"}`}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        )}
        
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
          <span className="tool-category-mini">{tool.primaryCategory || "AI Tool"}</span>
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

