import React from "react";
 import { 
  Briefcase, 
  GraduationCap, 
  PenTool, 
  Megaphone, 
  Presentation, // ✅ ChalkboardTeacher ki jagah ye use karo
  Video, 
  ChevronRight, 
  Copy, 
  Check, 
  RefreshCw 
} from "lucide-react";


import "./WorkFlowSection.css";

 const ROLE_OPTIONS = [
  { id: "founder", label: "Founder", icon: <Briefcase size={20} />, desc: "Launch & Scale" },
  { id: "student", label: "Student", icon: <GraduationCap size={20} />, desc: "Study Smarter" },
  { id: "freelancer", label: "Freelancer", icon: <PenTool size={20} />, desc: "Work Faster" },
  { id: "marketer", label: "Marketer", icon: <Megaphone size={20} />, desc: "Grow Brands" },
  { id: "teacher", label: "Teacher", icon: <Presentation size={20} />, desc: "Teach Better" }, // ✅ Icon updated
  { id: "creator", label: "Creator", icon: <Video size={20} />, desc: "Content Magic" },
];

const PersonalizedWorkflowSection = ({ userProfile, workflowState, onRolePicked, onChangeRole }) => {
  
  // 1. Loading State
  if (userProfile && workflowState.status === "loading") {
    return (
      <div className="workflow-loading">
        <div className="spinner"></div>
        <p>Aapka personalized workflow ready ho raha hai...</p>
      </div>
    );
  }

  // 2. Selection State (If no role)
  if (!userProfile) {
    return (
      <section className="workflow-selection-card">
        <div className="selection-header">
          <h2>Kaam khatam karne ka rasta chuno 🚀</h2>
          <p>Apna role select karein aur AI ke saath apna 1 hafte ka kaam 5 ghante mein khatam karein.</p>
        </div>
        <div className="role-grid">
          {ROLE_OPTIONS.map((role) => (
            <button key={role.id} className="role-btn" onClick={() => onRolePicked(role.id)}>
              <div className="role-icon">{role.icon}</div>
              <div className="role-info">
                <span className="role-name">{role.label}</span>
                <span className="role-desc">{role.desc}</span>
              </div>
              <ChevronRight size={16} className="arrow" />
            </button>
          ))}
        </div>
      </section>
    );
  }

  // 3. Workflow Display State (After role selection)
  const { data } = workflowState;
  if (!data) return null;

  return (
    <section className="active-workflow-section">
      <div className="workflow-top-bar">
        <div className="workflow-title-area">
          <span className="role-badge">{data.role} Edition</span>
          <h3>{data.headline}</h3>
          <p>{data.subline} — <strong>Save {data.timeSaved}</strong></p>
        </div>
        <button className="change-role-btn" onClick={onChangeRole}>
          <RefreshCw size={14} /> Change Role
        </button>
      </div>

      <div className="steps-container">
        {data.steps.map((step, index) => (
          <div key={index} className="workflow-step-card">
            <div className="step-number">{step.stepNumber}</div>
            
            <div className="step-content">
              <div className="step-main">
                <div className="tool-branding">
                  <img src={step.tool?.logo || "/default-tool.png"} alt={step.tool?.name} />
                  <div>
                    <h4>{step.action}</h4>
                    <span>use {step.tool?.name}</span>
                  </div>
                </div>
                <div className="time-tag">-{step.timeSaved}</div>
              </div>

              <p className="step-why">{step.why}</p>

              <div className="prompt-box">
                <code>{step.prompt}</code>
                <button 
                  className="copy-btn" 
                  onClick={() => navigator.clipboard.writeText(step.prompt)}
                  title="Copy Prompt"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PersonalizedWorkflowSection;