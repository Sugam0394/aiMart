 import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, GraduationCap, PenTool, Megaphone,
  Video, Code, Palette, Copy, Share2, Check, Sparkles
} from 'lucide-react';
import { fetchStack } from '../../../app/features/stackSlice';
import "./AiStackSection.css";

const ROLE_OPTIONS = [
  { id: 'founder',    label: 'Founder',    icon: <Briefcase size={18} /> },
  { id: 'marketer',   label: 'Marketer',   icon: <Megaphone size={18} /> },
  { id: 'creator',    label: 'Creator',    icon: <Video size={18} /> },
  { id: 'designer',   label: 'Designer',   icon: <Palette size={18} /> },
  { id: 'developer',  label: 'Developer',  icon: <Code size={18} /> },
  { id: 'freelancer', label: 'Freelancer', icon: <PenTool size={18} /> },
  { id: 'student',    label: 'Student',    icon: <GraduationCap size={18} /> },
];

const PricingBadge = ({ type }) => {
  const map = {
    free:     { label: 'Free',     color: '#22c55e' },
    freemium: { label: 'Freemium', color: '#f59e0b' },
    paid:     { label: 'Paid',     color: '#6366f1' },
  };
  const info = map[type] || { label: type, color: '#888' };
  return (
    <span className="pricing-badge" style={{ color: info.color, borderColor: info.color }}>
      {info.label}
    </span>
  );
};

const AiStackSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, status } = useSelector((state) => state.stack);

  const [selectedRole, setSelectedRole] = useState(() => localStorage.getItem('aimart_stack_role') || 'founder');
  // ✅ ADDED: Requirements state for Groq AI
  const [requirements, setRequirements] = useState('');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // ✅ UPDATED: Initial fetch
  useEffect(() => {
    dispatch(fetchStack({ role: selectedRole, requirements: '' }));
  }, [selectedRole, dispatch]);

  const handleRoleSelect = (roleId) => {
    localStorage.setItem('aimart_stack_role', roleId);
    setSelectedRole(roleId);
  };

  // ✅ ADDED: Handle AI Rank Button
  const handleAiRank = (e) => {
    e.preventDefault();
    dispatch(fetchStack({ role: selectedRole, requirements }));
  };

  const handleShareStack = () => {
    const shareUrl = `${window.location.origin}/stack/${selectedRole}`;
    navigator.clipboard.writeText(shareUrl);
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  const handleCopyStack = () => {
    if (!data?.tools) return;
    const stackText = data.tools
      .map(item => `${item.emoji} ${item.tool.name}: ${item.aiReason || item.reason}`)
      .join('\n');
    const fullText = `My ${data.role} aiStack from aiMart:\n\n${stackText}\n\nBuild yours → aimart.com`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="aistack-section">
      <div className="aistack-header">
        <div className="aistack-tag">⚡ AI RECOMMENDED</div>
        <h2 className="aistack-title">{data?.headline || "Professional aiStacks"}</h2>
        <p className="aistack-subtitle">{data?.subline || "Choose your role to instantly see the perfect AI toolkit."}</p>
      </div>

      <div className="role-tabs-wrapper">
        <div className="role-tabs-scroll">
          {ROLE_OPTIONS.map((role) => (
            <button 
              key={role.id} 
              className={`role-tab-btn ${selectedRole === role.id ? 'active' : ''}`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <span className="tab-icon">{role.icon}</span>
              <span className="tab-label">{role.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── ✅ NEW: AI INPUT BOX ── */}
      <form className="ai-input-container" onSubmit={handleAiRank}>
        <div className="ai-input-glow-wrapper">
          <input 
            type="text" 
            className="ai-custom-input"
            placeholder="What do you want to achieve? (e.g. Automate my social media...)"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
          <button type="submit" className="ai-rank-btn" disabled={status === 'loading'}>
            <Sparkles size={16} />
            {status === 'loading' ? 'Ranking...' : 'Rank with AI'}
          </button>
        </div>
      </form>

      <div className={`stack-display-container ${status === 'loading' ? 'is-loading' : ''}`}>
        {status === 'loading' ? (
          <div className="aistack-loading-overlay">
            <div className="loading-spinner" />
            <p>AI is curating your {selectedRole} stack...</p>
          </div>
        ) : (
          <>
            <div className="stack-tools-grid">
              {data?.tools?.map((item, idx) => (
                <div key={idx} className="stack-tool-card-wrapper">
                  
                  {/* ✅ NEW: Groq AI Reason Bubble */}
                  <div className="ai-reason-bubble">
                    <Sparkles size={12} className="sparkle-icon" />
                    {item.aiReason || item.reason}
                  </div>

                  <div className="stack-tool-card">
                    <div className="stack-card-category">
                      <span>{item.emoji}</span> {item.tool.primaryCategory || 'Tool'}
                    </div>
                    <div className="stack-card-body">
                      <img src={item.tool.logo || '/default-tool.png'} alt={item.tool.name} className="stack-tool-logo" />
                      <div className="stack-tool-info">
                        <h4 className="stack-tool-name">{item.tool.name}</h4>
                        <p className="stack-tool-label">{item.tool.tagline || item.label}</p>
                        <PricingBadge type={item.tool.pricingType} />
                      </div>
                    </div>
                    <button className="view-tool-btn" onClick={() => navigate(`/tools/${item.tool._id}`)}>
                      View Tool →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="stack-actions">
              <button className="stack-action-btn copy-btn" onClick={handleCopyStack}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Copied!' : `Copy ${data?.role || ''} Stack`}
              </button>
              <button className="stack-action-btn share-btn" onClick={handleShareStack}>
                {shared ? <Check size={15} /> : <Share2 size={15} />}
                {shared ? 'Link Copied!' : 'Share Stack'}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AiStackSection;