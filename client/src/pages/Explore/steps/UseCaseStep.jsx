import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectExploreSessionId, selectStepPayload } from '../../../app/exploreFeatures/exploreSelectors';
import SelectionOption from './components/SelectionOption';

import "./styles/UseCaseStep.css";

function getOptionValue(useCase) {
  const isObject = typeof useCase === 'object' && useCase !== null;
  return isObject ? (useCase.id || useCase.value) : useCase;
}

function getOptionLabel(useCase) {
  const isObject = typeof useCase === 'object' && useCase !== null;
  return isObject ? (useCase.label || useCase.title) : useCase;
}

function UseCaseStep() {
  const dispatch = useDispatch();
  const sessionId = useSelector(selectExploreSessionId);
  const stepPayload = useSelector(selectStepPayload);
  const [selectedUseCase, setSelectedUseCase] = useState(null);

  const useCases = Array.isArray(stepPayload) ? stepPayload : stepPayload?.useCases || [];

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

  return (
    <div className="usecase-step">
      <h2>Select what you want help with</h2>

      {useCases.length === 0 && (
        <p className="no-data">No options found for this selection.</p>
      )}

      <div className="usecase-list">
        {useCases.map((useCase, index) => {
          const value = getOptionValue(useCase);
          const label = getOptionLabel(useCase);
          return (
            <SelectionOption
              key={value || index}
              label={label}
              isSelected={selectedUseCase === value}
              onClick={() => setSelectedUseCase(value)}
            />
          );
        })}
      </div>

      <button
        className="continue-btn"
        onClick={handleSubmit}
        disabled={!selectedUseCase}
      >
        Continue
      </button>
    </div>
  );
}

export default UseCaseStep