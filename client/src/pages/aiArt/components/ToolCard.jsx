 import { useNavigate } from "react-router-dom";
import "./ToolCard.css";
 

function ToolCard({ tool }) {
  const navigate = useNavigate();

 

  return (
    
   <div className="tool-card" onClick={() => navigate(`/tools/${tool._id}`)}>
      
      {/* Image */}
      <div className="tool-card-image">
        <img src={tool.logo} alt={tool.name} />
      </div>

      {/* Footer */}
      <div className="tool-card-footer">
        <h4 className="tool-name">{tool.name}</h4>
        <span className="tool-view">View →</span>
      </div>

    </div>
 

 
  );
}

export default ToolCard;

