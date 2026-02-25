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
      {label}
    </button>
  );
}

export default SelectionOption;
