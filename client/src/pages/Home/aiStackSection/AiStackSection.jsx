 import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, GraduationCap, PenTool, Megaphone,
  Video, Code, Palette, RefreshCw, Copy, Share2, Check
} from 'lucide-react';
import { fetchStack, clearStack } from '../../../app/features/stackSlice';
import './AiStackSection.css';

const ROLE_OPTIONS = [
  { id: 'founder',    label: 'Founder',    icon: <Briefcase size={20} />,    desc: 'Launch & Scale' },
  { id: 'marketer',   label: 'Marketer',   icon: <Megaphone size={20} />,    desc: 'Grow Brands' },
  { id: 'creator',    label: 'Creator',    icon: <Video size={20} />,         desc: 'Content Magic' },
  { id: 'designer',   label: 'Designer',   icon: <Palette size={20} />,       desc: 'Create Visuals' },
  { id: 'developer',  label: 'Developer',  icon: <Code size={20} />,          desc: 'Ship Faster' },
  { id: 'freelancer', label: 'Freelancer', icon: <PenTool size={20} />,       desc: 'Work Faster' },
  { id: 'student',    label: 'Student',    icon: <GraduationCap size={20} />, desc: 'Study Smarter' },
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

  const [selectedRole, setSelectedRole] = useState(() => {
    return localStorage.getItem('aimart_stack_role') || null;
  });
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (selectedRole && status === 'idle') {
      dispatch(fetchStack(selectedRole));
    }
  }, [selectedRole, status, dispatch]);

  const handleRoleSelect = (roleId) => {
    localStorage.setItem('aimart_stack_role', roleId);
    setSelectedRole(roleId);
    dispatch(fetchStack(roleId));
  };

  const handleChangeRole = () => {
    localStorage.removeItem('aimart_stack_role');
    setSelectedRole(null);
    dispatch(clearStack());
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
      .map(item => `${item.emoji} ${item.category}: ${item.tool.name}`)
      .join('\n');
    const fullText = `My ${data.role} aiStack from aiMart:\n\n${stackText}\n\nBuild yours → aimart.com/stack/${selectedRole}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // STATE 1: Role Selection UI
  if (!selectedRole) {
    return (
      <section className="aistack-section">
        <div className="aistack-header">
          <div className="aistack-tag">⚡ NEW</div>
          <h2 className="aistack-title">Build Your aiStack</h2>
          <p className="aistack-subtitle">Select your role — get the exact AI tools top professionals use</p>
        </div>
        <div className="role-grid">
          {ROLE_OPTIONS.map((role) => (
            <button key={role.id} className="role-pill" onClick={() => handleRoleSelect(role.id)}>
              <span className="role-pill-icon">{role.icon}</span>
              <div className="role-pill-text">
                <span className="role-pill-label">{role.label}</span>
                <span className="role-pill-desc">{role.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    );
  }

  // STATE 2: Loading UI
  if (status === 'loading') {
    return (
      <section className="aistack-section">
        <div className="aistack-loading">
          <div className="loading-spinner" />
          <p>Building your stack...</p>
        </div>
      </section>
    );
  }

  // BUG 5 FIX: Error State (Add before success UI)
  if (status === 'failed' || status === 'error') {
    return (
      <section className="aistack-section">
        <div className="aistack-error-container" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#888', marginBottom: '20px' }}>Aree! Stack load nahi ho paaya. Network check karein?</p>
          <button className="change-role-btn" onClick={handleChangeRole} style={{ margin: '0 auto' }}>
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      </section>
    );
  }

  // STATE 3: Success UI (Stack Ready)
  if (status === 'success' && data) {
    const roleInfo = ROLE_OPTIONS.find(r => r.id === selectedRole);
    return (
      <section className="aistack-section aistack-active">
        <div className="aistack-top-bar">
          <div>
            <span className="stack-role-badge">{roleInfo?.icon} {data.role} Stack</span>
            <h2 className="aistack-title">{data.headline}</h2>
            <p className="aistack-subtitle">{data.subline}</p>
          </div>
          <button className="change-role-btn" onClick={handleChangeRole}>
            <RefreshCw size={14} /> Change Role
          </button>
        </div>

        <div className="stack-tools-grid">
          {data.tools.map((item, idx) => (
            <div key={idx} className="stack-tool-card">
              <div className="stack-card-category">
                <span>{item.emoji}</span>
                <span>{item.category}</span>
              </div>
              <div className="stack-card-body">
                <img src={item.tool.logo || '/default-tool.png'} alt={item.tool.name} className="stack-tool-logo" />
                <div className="stack-tool-info">
                  <h4 className="stack-tool-name">{item.tool.name}</h4>
                  <p className="stack-tool-label">{item.label}</p>
                  <PricingBadge type={item.tool.pricingType} />
                </div>
              </div>
              <button className="view-tool-btn" onClick={() => navigate(`/tools/${item.tool._id}`)}>
                View Tool →
              </button>
            </div>
          ))}
        </div>

        <div className="stack-actions">
          <button className="stack-action-btn copy-btn" onClick={handleCopyStack}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy My Stack'}
          </button>
          <button className="stack-action-btn share-btn" onClick={handleShareStack}>
            {shared ? <Check size={15} /> : <Share2 size={15} />}
            {shared ? 'Link Copied!' : 'Share Stack'}
          </button>
        </div>
      </section>
    );
  }

  return null;
};

export default AiStackSection;