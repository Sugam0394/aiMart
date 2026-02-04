 // components/Explore/StepShell.jsx
import React from 'react';

const StepShell = ({ title, isCompleted, isLocked, onEdit, summaryValue, children, stepNumber }) => {
  return (
    <div className={`step-shell ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${!isCompleted && !isLocked ? 'active' : ''}`}>
      <div className="step-header">
        <div className="step-indicator">{isCompleted ? '✓' : stepNumber}</div>
        <div className="step-title-area">
          <h3>{title}</h3>
          {isCompleted && <p className="step-summary-text">{summaryValue}</p>}
        </div>
        {isCompleted && (
          <button className="edit-btn" onClick={onEdit}>✏️ Edit</button>
        )}
      </div>
      
      {!isCompleted && !isLocked && (
        <div className="step-content-animation">
          {children}
        </div>
      )}
    </div>
  );
};

export default StepShell;


