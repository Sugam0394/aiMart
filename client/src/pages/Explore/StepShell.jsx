import React from 'react';
import "./styles/StepShell.css";

const StepShell = ({ 
  title, 
  isCompleted, 
  isLocked, 
  onEdit, 
  summaryValue, 
  children, 
  stepNumber 
}) => {
  return (
    <div className={`step-shell 
      ${isCompleted ? 'completed' : ''} 
      ${isLocked ? 'locked' : ''} 
      ${!isCompleted && !isLocked ? 'active' : ''}`}
    >
      <div className="step-header">
        <div className="step-indicator">
          {isCompleted ? <span className="check-icon">✓</span> : stepNumber}
        </div>
        
        <div className="step-title-area">
          <h3 className="shell-title">{title}</h3>
          {isCompleted && summaryValue && (
            <div className="summary-pill">
              <span>{summaryValue}</span>
            </div>
          )}
        </div>

        {isCompleted && (
          <button className="edit-shell-btn" onClick={onEdit}>
            Change
          </button>
        )}
      </div>
      
      {/* Sirf tab dikhao jab active ho */}
      {!isCompleted && !isLocked && (
        <div className="step-content-body">
          {children}
        </div>
      )}

      {isLocked && (
        <div className="lock-overlay">
          <span>Complete previous step to unlock</span>
        </div>
      )}
    </div>
  );
};

export default StepShell; 


