import React, { useState } from "react";
import { toolApi } from "../../../api/toolOwner/tool.services";
import ToolCard from "../../aiArt/components/ToolCard";
import "./SmartSolver.css";
import ToolCardSkeleton from "../../aiArt/components/ToolCardSkeleton";

const SOLVER_OPTIONS = [
  { id: 1, label: "📝 Study Help", slug: "study-better" },
  { id: 2, label: "✍️ Write Content", slug: "create-content" },
  { id: 3, label: "🎨 Design Graphics", slug: "design-faster" },
  { id: 4, label: "💻 Help Me Code", slug: "code-smarter" },
  { id: 5, label: "📈 Grow Business", slug: "grow-business" },
  { id: 6, label: "💼 Build Resume", slug: "build-career" },
  { id: 7, label: "⚙️ Automate Tasks", slug: "automate-work" },
];

const SmartSolverSection = () => {
  const [activeAction, setActiveAction] = useState(null);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSolution = async (slug) => {
    setActiveAction(slug);
    setLoading(true);
    try {
      // Ab humara global api instance automatically token aur baseURL handle karega
      const response = await toolApi.getQuickSolution(slug);
      
      // Axios response structure match karo (response.data backend ka hai)
      setTools(response.data?.data || []);
      
    } catch (err) {
      console.error("Solver Error caught in component:", err);
      setTools([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="smart-solver-section">
      <div className="solver-header">
        <h3>What are you trying to achieve?</h3>
        <p>Select your goal and we'll reveal the top 3 AI tools to get it done.</p>
      </div>

      <div className="chips-container">
        {SOLVER_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            className={`solver-chip ${activeAction === opt.slug ? "active" : ""}`}
            onClick={() => fetchSolution(opt.slug)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="solver-results-area">
        {loading ? (
          <div className="usecase-row-container">
            {/* Spinner ki jagah 3 Skeletons (kyuki aap 3 tools dikhate ho) */}
            {[1, 2, 3].map((n) => <ToolCardSkeleton key={n} />)}
          </div>
        ) : tools.length > 0 ? (
          <div className="usecase-row-container">
            {tools.map((tool) => (
              <ToolCard key={tool._id} tool={tool} />
            ))}
          </div>
        ) : activeAction ? (
          <p className="no-results">No tools found for this goal yet. Try another!</p>
        ) : (
          <p className="prompt-text">Click a goal above to see the magic ↗️</p>
        )}
      </div>
    </div>
  );
};

export default SmartSolverSection; 