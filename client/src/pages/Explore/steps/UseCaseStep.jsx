import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectExploreSessionId, selectStepPayload } from '../../../app/exploreFeatures/exploreSelectors';
import SelectionOption from './components/SelectionOption';

import "./styles/UseCaseStep.css";

 

 // UseCaseStep.js
function UseCaseStep() {
  const dispatch = useDispatch();
  const sessionId = useSelector(selectExploreSessionId);
  const stepPayload = useSelector(selectStepPayload);
  const [selectedUseCase, setSelectedUseCase] = useState(null);

  // ✅ Simplified - Backend sends string array
  const useCases = Array.isArray(stepPayload) ? stepPayload : [];

  const handleSubmit = () => {
    if (!selectedUseCase) return;
    dispatch(
      submitExploreStepThunk({
        sessionId,
        currentStep: "USE_CASE",
        stepData: { useCase: selectedUseCase },
      })
    );
  };

  if (useCases.length === 0) {
    return (
      <div className="usecase-step">
        <div className="no-data-state">
          <span className="icon">🔍</span>
          <p>No use cases available. Please try a different intent.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="usecase-step">
      <h2>What exactly do you need help with?</h2>

      <div className="usecase-grid">
        {useCases.map((useCase, index) => (
          <SelectionOption
            key={useCase || index}
            label={useCase.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} // "code-generation" → "Code Generation"
            isSelected={selectedUseCase === useCase}
            onClick={() => setSelectedUseCase(useCase)}
          />
        ))}
      </div>

      <button
        className="primary-action-btn"
        onClick={handleSubmit}
        disabled={!selectedUseCase}
      >
        Show Me Tools →
      </button>
    </div>
  );
}

export default UseCaseStep