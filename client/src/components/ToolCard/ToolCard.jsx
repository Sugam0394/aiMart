import "./ToolCard.css";

function ToolCard({ toolName, description, category, actionLabel }) {
  return (
    <div className="tool-card">
      <span className="tool-card__category">{category}</span>
      <h3 className="tool-card__name">{toolName}</h3>
      <p className="tool-card__description">{description}</p>
      <span className="tool-card__action">{actionLabel}</span>
    </div>
  );
}

export default ToolCard;
