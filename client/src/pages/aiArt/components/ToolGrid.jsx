 import ToolCard from "./ToolCard";
import "./ToolGrid.css";
import SectionWrapper from "../../../layouts/section/SectionWrapper";

function ToolGrid({ tools }) {
  if (!tools.length) {
    return <SectionWrapper title="Trending Tools">
      <p className="empty-text">No tools available yet</p>
    </SectionWrapper>;
  }

  return (
    <SectionWrapper title="Trending Tools" subtitle="Top AI tools right now">
      <div className="tools-container">
        {tools.map((tool) => (
          <ToolCard key={tool._id} tool={tool} />
        ))}
      </div>
    </SectionWrapper>
  );
}

export default ToolGrid;


