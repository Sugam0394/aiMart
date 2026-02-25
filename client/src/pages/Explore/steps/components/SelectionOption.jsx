 import React from 'react';
import './SelectionOption.css';

function SelectionOption({ label, isSelected, onClick }) {
  return (
    <button
      type="button"
      className={`usecase-btn ${isSelected ? "active" : ""}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <span className="btn-label">{label}</span>
    </button>
  );
}

export default SelectionOption;
