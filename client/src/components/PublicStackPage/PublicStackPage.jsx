import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStack } from '../../app/features/stackSlice';
import { Sparkles, ArrowRight, Share2 } from 'lucide-react';
import './PublicStackPage.css';

const PublicStackPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.stack);

  useEffect(() => {
    if (role) {
      dispatch(fetchStack(role));
    }
  }, [role, dispatch]);

   if (status === 'loading') {
    return (
      <div className="stack-loader-container">
        <div className="stack-loader">Curating the best tools...</div>
      </div>
    );
  }

  return (
    <div className="public-stack-container">
      {/* Hero Branding */}
      <header className="public-stack-header">
        <div className="viral-badge">
          <Sparkles size={14} /> Shared via aiMart
        </div>
        <h1 className="viral-title">
          The Ultimate <span>{role?.toUpperCase()}</span> AI Stack
        </h1>
        <p className="viral-subtitle">
          Handpicked tools to automate your workflow and 10x your output.
        </p>
      </header>

      {/* Tools List */}
      <div className="public-tools-list">
        {data?.tools?.map((item, idx) => (
          <div 
            key={idx} 
            className="viral-tool-item"
            onClick={() => navigate(`/tool/${item.tool.slug}`)}
          >
            <div className="tool-rank">{idx + 1}</div>
            <img src={item.tool.logo} alt={item.tool.name} className="tool-mini-logo" />
            <div className="tool-details">
              <h3>{item.tool.name}</h3>
              <p>{item.label}</p>
            </div>
            <div className="v-view-btn-wrapper">
              <button className="v-view-btn">View</button>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom CTA */}
      <div className="viral-cta-bar-wrapper">
        <div className="viral-cta-bar">
          <div className="cta-text">
            <h4>Want your own custom stack?</h4>
            <p>Join 5,000+ professionals on aiMart.</p>
          </div>
          <button className="cta-main-btn" onClick={() => navigate('/register')}>
            Build Mine <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicStackPage;