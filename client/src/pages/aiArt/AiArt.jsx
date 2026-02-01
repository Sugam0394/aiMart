 import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
 import api from "../../api/axios";
import "./AiArt.css";

function AiArt() {
  const { id } = useParams();

  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const res = await api.get(`/tools/${id}`);
          console.log("API response:", res); // ✅ check what comes
        setTool(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Tool not found");
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [id]);

  if (loading) return <p className="state-text">Loading...</p>;
  if (error) return <p className="state-text">{error}</p>;

  return (
    <div className="aiart-page">
      {/* HEADER */}
      <section className="aiart-header">
        <div className="tool-info">
          <div className="logo-box">
            <img src={tool.logo} alt={tool.name} />
          </div>
          <div className="tool-text">
            <h1>{tool.name}</h1>
            <p>{tool.tagline}</p>
            {tool.primaryCategory && (
              <span className="primary-category">{tool.primaryCategory}</span>
            )}
            {tool.intentTags?.length > 0 && (
              <div className="intent-tags">
                {tool.intentTags.map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="aiart-section">
        <h2>About</h2>
        <p>{tool.description}</p>
      </section>

      {/* USE CASES */}
      {tool.useCases?.length > 0 && (
        <section className="aiart-section">
          <h2>What you can do</h2>
          <ul className="usecase-list">
            {tool.useCases.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* REVIEW */}
      {tool.review?.comment && (
        <section className="review-box">
          <p>“{tool.review.comment}”</p>
          <span>— AI-Mart Curated</span>
        </section>
      )}
    </div>
  );
}

export default AiArt;

