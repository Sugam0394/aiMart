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
        setTool(res.data.data);
      } catch {
        setError("Tool not found");
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [id]);

  
 // --- Actions ---
  const handleSave = async () => {
    try {
      // Backend route: /api/users/save-tool/:toolId
      // Ensure your axios instance 'api' has the /api prefix already
      const res = await api.post(`/save/${id}`); 
      
      if (res.data.success) {
        setTool(prev => ({ ...prev, isSaved: res.data.isSaved }));
        // Thoda wit:
        console.log(res.data.isSaved ? "Bhai, tool dil mein utar gaya! ❤️" : "Tool dil se nikal gaya! 💔");
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert(err.response?.status === 401 ? "Pehle login toh kar lo, dost!" : "Kuch toh gadbad hai...");
    }
  };

  const handleShare = async () => {
    // Current Page URL
    const shareData = {
      title: `Check out ${tool?.name} on AI-Mart!`,
      text: tool?.tagline,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log("Share cancel ho gaya.");
      }
    } else {
      // Fallback for desktop browsers
      navigator.clipboard.writeText(window.location.href);
      alert("URL copy ho gaya! Ab kahin bhi chipka do. 🚀");
    }
  };

  if (loading) return <div className="state-text">Loading AI Tool...</div>;
  if (error) return <div className="state-text">{error}</div>;

  return (
    <div className="aiart-page-wrapper">
      <div className="container-70-30">
        
        {/* LEFT COLUMN */}
        <main className="tool-content-area">
          <header className="tool-hero-minimal">
            <div className="hero-logo-container">
              <img src={tool?.logo} alt={tool?.name} />
            </div>
            <div className="hero-titles">
              <div className="name-badge-row">
                <h1>{tool?.name}</h1>
                {tool?.review && <span className="verified-badge">✔ Verified</span>}
              </div>
              <p className="tagline-large">{tool?.tagline}</p>
            </div>
          </header>

          <section className="tool-detail-section">
            <h3>Description</h3>
            <p className="description-text">{tool?.description}</p>
          </section>

          {/* Expert Scorecard (Progress Bars) */}
          {tool?.review && (
            <section className="tool-detail-section rating-card">
              <h3>Expert Benchmark</h3>
              <div className="rating-grid">
                {['utility', 'easeOfUse', 'valueForMoney'].map((key) => (
                  <div className="rating-row" key={key}>
                    <span className="rating-label">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: `${(tool.review.rating[key] / 5) * 100}%` }}></div>
                    </div>
                    <span className="rating-num">{tool.review.rating[key]}/5</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tool?.useCases?.length > 0 && (
            <section className="tool-detail-section">
              <h3>Best Use Cases</h3>
              <div className="usecase-chips">
                {tool.useCases.map((useCase, index) => (
                  <div key={index} className="case-card">
                    <span className="dot"></span> {useCase.replace('-', ' ')}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="tool-detail-section review-wrapper">
            <h3>Curator's Note</h3>
            <div className={tool?.review ? "curated-review" : "no-review-yet"}>
              {tool?.review ? (
                <>
                  <p>"{tool.review.comment}"</p>
                  <div className="review-meta">— AI-Mart Founder</div>
                </>
              ) : (
                <p>We are currently auditing <strong>{tool?.name}</strong>. Official badge is pending.</p>
              )}
            </div>
          </section>
        </main>

        {/* RIGHT COLUMN (Sticky Sidebar) */}
        <aside className="tool-sidebar-sticky">
          <div className="action-card">
            <a href={tool?.url} target="_blank" rel="noreferrer" className="btn-visit-main">
              Visit Website <span className="arrow">↗</span>
            </a>

            <div className="secondary-actions">
              <button onClick={handleSave} className={`btn-icon ${tool?.isSaved ? 'active' : ''}`}>
                {tool?.isSaved ? '❤️ Saved' : '🤍 Save'}
              </button>
              <button onClick={handleShare} className="btn-icon">📤 Share</button>
            </div>
            
            <div className="metadata-grid">
              <div className="meta-item">
                <label>Pricing Model</label>
                <span className="val">{tool?.pricingType}</span>
              </div>
              <div className="meta-item">
                <label>Categories</label>
                <div className="intent-pills">
                  {tool?.intentTags.map(tag => (
                    <span key={tag} className="pill">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AiArt; 
 

