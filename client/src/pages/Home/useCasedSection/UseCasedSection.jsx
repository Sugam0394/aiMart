import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchToolsByUseCase } from "../../../app/features/MomentSlice";
import ToolCard from "../../aiArt/components/ToolCard";
import { useNavigate } from "react-router-dom";
import './UseCasedSection.css';

function UseCaseSection({ useCaseKey, title, subtitle }) {
 
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const section = useSelector(
    (state) => state.moment.useCaseSections?.[useCaseKey]
  );

  const tools = section?.tools || [];
  const status = section?.status;

  useEffect(() => {
    if (!section) {
      dispatch(fetchToolsByUseCase(useCaseKey));
    }
  }, [useCaseKey, section , dispatch]);

  if (status === "loading") {
    return <p>Loading {title}...</p>;
  }

  if (status === "error") { return <p>Failed to load {title}. Please try again.</p>; }

  if (!tools.length) {
    return null; 
  }

  return (
      <div className="usecase-section">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}

      <div className="tool-grid">
        {tools.map((tool) => (
          <ToolCard
            key={tool._id}
            tool={tool}
            onClick={() => navigate(`/tools/${tool._id}`)} // ✅ ToolPage navigation
          />
        ))}
      </div>
    </div>
  );
}

export default UseCaseSection;
