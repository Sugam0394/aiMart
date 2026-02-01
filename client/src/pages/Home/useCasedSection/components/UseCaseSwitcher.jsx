import React from "react";
import "./UseCaseSwitcher.css";

const useCases = [
  { key: "code-smarter", label: "Code Smarter" },
  { key: "study-better", label: "Study Better" },
  { key: "create-content", label: "Create Content" },
  { key: "grow-business", label: "Grow Business" },
  { key: "design-faster", label: "Design Faster" },
  { key: "build-career", label: "Build Career" },
  { key: "automate-work", label: "Automate Work" },
];

function UseCaseSwitcher({ activeUseCase, onChange }) {
  return (
    <div className="usecase-switcher">
      {useCases.map((item) => (
        <button
          key={item.key}
          className={`pill ${activeUseCase === item.key ? "active" : ""}`}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default UseCaseSwitcher;
