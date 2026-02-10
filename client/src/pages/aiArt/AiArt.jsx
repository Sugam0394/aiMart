import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSaveTool } from "../../app/features/SavedSlice";
import api from "../../api/axios";
import "./AiArt.css";

function AiArt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if tool is saved (from Redux)
  const isSaved = useSelector((state) => 
    state.saved.savedIds.includes(id)
  );

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const res = await api.get(`/tools/${id}`);
        setTool(res.data.tool || res.data.data);
      } catch {
        setError("Tool not found");
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [id]);

  // ✅ Gradient fallback for missing logos
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

  const getGradient = () => {
    return gradientsByCategory[tool?.primaryCategory] || gradientsByCategory.ai;
  };

  // --- Actions ---
  const handleSave = () => {
    if (!tool) return;
    dispatch(toggleSaveTool(tool));
  };

  const handleShare = async () => {
    const shareData = {
      title: `${tool?.name} - AI Tool`,
      text: tool?.tagline,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled" , err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="aiart-page-wrapper">
        <div className="loading-state">
          <div className="loader-spinner"></div>
          <p>Loading tool details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aiart-page-wrapper">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Tool Not Found</h2>
          <p>This tool doesn't exist or has been removed.</p>
          <button onClick={handleBack} className="btn-back">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="aiart-page-wrapper">
      {/* ✅ Breadcrumb Navigation */}
      <div className="breadcrumb-nav">
        <button onClick={handleBack} className="breadcrumb-link">
          ← All Tools
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{tool?.name}</span>
      </div>

      <div className="container-70-30">
        {/* LEFT COLUMN */}
        <main className="tool-content-area">
          
          {/* ✅ Hero Section - Premium Design */}
          <header className="tool-hero-premium">
            <div className="hero-layout">
              <div className="hero-logo-wrapper">
                {imageError || !tool?.logo ? (
                  <div 
                    className="hero-logo-gradient"
                    style={{ background: getGradient() }}
                  >
                    <span className="hero-initial">
                      {tool?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <img 
                    src={tool?.logo} 
                    alt={tool?.name}
                    className="hero-logo-image"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>

              <div className="hero-content">
                <div className="hero-badges">
                  <span className={`pricing-badge ${tool?.pricingType?.toLowerCase()}`}>
                    {tool?.pricingType}
                  </span>
                  {tool?.isFeatured && (
                    <span className="featured-badge">⭐ Featured</span>
                  )}
                  {tool?.isPopular && (
                    <span className="popular-badge">🔥 Popular</span>
                  )}
                  {tool?.review && (
                    <span className="verified-badge">✓ Verified</span>
                  )}
                </div>

                <h1 className="hero-title">{tool?.name}</h1>
                <p className="hero-tagline">{tool?.tagline}</p>

                {/* ✅ Quick Stats */}
                <div className="hero-stats">
                  {tool?.avgRating > 0 && (
                    <div className="stat-item">
                      <span className="stat-icon">⭐</span>
                      <span className="stat-value">{tool.avgRating.toFixed(1)}</span>
                      <span className="stat-label">Rating</span>
                    </div>
                  )}
                  {tool?.totalReviews > 0 && (
                    <div className="stat-item">
                      <span className="stat-icon">💬</span>
                      <span className="stat-value">{tool.totalReviews}</span>
                      <span className="stat-label">Reviews</span>
                    </div>
                  )}
                  <div className="stat-item">
                    <span className="stat-icon">🏷️</span>
                    <span className="stat-value">{tool?.primaryCategory}</span>
                    <span className="stat-label">Category</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* ✅ Description Section */}
          <section className="content-section">
            <div className="section-header">
              <h2>Overview</h2>
            </div>
            <p className="description-text">{tool?.description}</p>
          </section>

          {/* ✅ Use Cases - Card Layout */}
          {tool?.useCases?.length > 0 && (
            <section className="content-section">
              <div className="section-header">
                <h2>Perfect For</h2>
                <span className="section-subtitle">
                  {tool.useCases.length} use cases
                </span>
              </div>
              <div className="usecase-grid">
                {tool.useCases.map((useCase, index) => (
                  <div key={index} className="usecase-card">
                    <div className="usecase-icon">✨</div>
                    <span className="usecase-text">
                      {useCase.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ✅ Expert Rating - Modern Design */}
          {tool?.review && (
            <section className="content-section">
              <div className="section-header">
                <h2>Expert Rating</h2>
                <div className="overall-score">
                  {(() => {
                    const avg = (
                      (tool.review.rating.utility +
                        tool.review.rating.easeOfUse +
                        tool.review.rating.valueForMoney) / 3
                    ).toFixed(1);
                    return (
                      <>
                        <span className="score-number">{avg}</span>
                        <span className="score-max">/5</span>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              <div className="rating-bars">
                {[
                  { key: 'utility', label: 'Utility', icon: '⚙️' },
                  { key: 'easeOfUse', label: 'Ease of Use', icon: '✨' },
                  { key: 'valueForMoney', label: 'Value for Money', icon: '💰' }
                ].map(({ key, label, icon }) => (
                  <div className="rating-item" key={key}>
                    <div className="rating-header">
                      <span className="rating-icon">{icon}</span>
                      <span className="rating-label">{label}</span>
                      <span className="rating-score">
                        {tool.review.rating[key]}/5
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(tool.review.rating[key] / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ✅ Review Section - Testimonial Style */}
          <section className="content-section review-section">
            <div className="section-header">
              <h2>Curator's Review</h2>
            </div>
            {tool?.review ? (
              <div className="review-card">
                <div className="review-quote">"</div>
                <p className="review-text">{tool.review.comment}</p>
                <div className="review-author">
                  <div className="author-avatar">
                    <span>AM</span>
                  </div>
                  <div className="author-info">
                    <div className="author-name">AI-Mart Curator</div>
                    <div className="author-title">Verified Expert</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-review-card">
                <div className="no-review-icon">🔍</div>
                <h3>Under Review</h3>
                <p>Our team is currently evaluating <strong>{tool?.name}</strong>. Check back soon for an expert review!</p>
              </div>
            )}
          </section>

          {/* ✅ Tags Section */}
          {tool?.intentTags?.length > 0 && (
            <section className="content-section">
              <div className="section-header">
                <h2>Tags</h2>
              </div>
              <div className="tags-cloud">
                {tool.intentTags.map(tag => (
                  <span key={tag} className="tag-pill">
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* RIGHT COLUMN - Sticky Sidebar */}
        <aside className="tool-sidebar-sticky">
          <div className="action-card">
            
            {/* ✅ Primary CTA */}
            <a 
              href={tool?.url} 
              target="_blank" 
              rel="noreferrer noopener" 
              className="btn-visit-premium"
            >
              <span className="btn-text">Visit {tool?.name}</span>
              <span className="btn-icon">→</span>
            </a>

            {/* ✅ Secondary Actions */}
            <div className="action-buttons">
              <button 
                onClick={handleSave} 
                className={`action-btn ${isSaved ? 'saved' : ''}`}
              >
                <span className="btn-emoji">{isSaved ? '❤️' : '🤍'}</span>
                <span className="btn-label">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
              
              <button onClick={handleShare} className="action-btn">
                <span className="btn-emoji">{copied ? '✓' : '📤'}</span>
                <span className="btn-label">{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            <div className="divider"></div>

            {/* ✅ Tool Metadata */}
            <div className="metadata-list">
              <div className="meta-row">
                <span className="meta-label">Pricing</span>
                <span className={`meta-value pricing-${tool?.pricingType?.toLowerCase()}`}>
                  {tool?.pricingType || 'Free'}
                </span>
              </div>

              <div className="meta-row">
                <span className="meta-label">Type</span>
                <span className="meta-value">{tool?.toolType || 'AI Tool'}</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">Usage</span>
                <span className="meta-value">{tool?.usageMode || 'Online'}</span>
              </div>

              {tool?.avgRating > 0 && (
                <div className="meta-row">
                  <span className="meta-label">Rating</span>
                  <span className="meta-value rating-value">
                    ⭐ {tool.avgRating.toFixed(1)}/5
                  </span>
                </div>
              )}
            </div>

            {/* ✅ Trust Signals */}
            <div className="trust-signals">
              {tool?.status === 'live' && (
                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span className="trust-text">Verified Tool</span>
                </div>
              )}
              {tool?.isPopular && (
                <div className="trust-item">
                  <span className="trust-icon">🔥</span>
                  <span className="trust-text">Trending Now</span>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Info Card */}
          <div className="info-card">
            <div className="info-icon">💡</div>
            <h4>Pro Tip</h4>
            <p>Save this tool to access it later from your dashboard.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AiArt; 
 

