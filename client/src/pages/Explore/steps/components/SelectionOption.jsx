import './SelectionOption.css'

function SelectionOption({ label, isSelected, onClick }) {
  return (
    <button
      type="button"
      className={`usecase-btn ${isSelected ? "active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default SelectionOption;
