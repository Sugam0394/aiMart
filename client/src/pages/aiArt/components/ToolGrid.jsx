import ToolCard from "./ToolCard";
import "./ToolGrid.css";

function ToolGrid({ tools }) {
  // Agar tools nahi hain toh sirf ek simple message dikhao
  if (!tools || !tools.length) {
    return (
      <div className="tools-empty-state">
        <p className="empty-text">No tools available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="tools-container">
      {tools.map((tool) => (
        <ToolCard key={tool._id || tool.id} tool={tool} />
      ))}
    </div>
  );
}

export default ToolGrid; 


