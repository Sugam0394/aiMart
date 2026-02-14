import React, { useState } from "react";
import axios from "axios"; // Direct axios import
import ToolCard from "../../aiArt/components/ToolCard";
import "./SmartSolver.css";

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
      
      const response = await axios.get(`/api/quick-solution?action=${slug}`);
      
      console.log("Response Data:", response.data);
      setTools(response.data?.data || []);
      
    } catch (err) {
      console.error("Solver Error:", err);
      // Agar upar wala fail ho toh bina '/tools' ke try karo (Fallback)
      try {
          const retryRes = await axios.get(`/api/quick-solution?action=${slug}`);
          setTools(retryRes.data?.data || []);
      } catch (retryErr) {
          console.error("Retry also failed:", retryErr);
          setTools([]);
      }
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
          <div className="solver-loader">
             <div className="spinner"></div>
             <p>Finding expert tools...</p>
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