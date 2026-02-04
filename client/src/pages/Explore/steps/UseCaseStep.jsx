import React from 'react'
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectExploreSessionId , selectStepPayload } from '../../../app/exploreFeatures/exploreSelectors';

import "./styles/UseCaseStep.css";





function UseCaseStep() {
 const dispatch = useDispatch();
  const sessionId = useSelector(selectExploreSessionId);
  const stepPayload = useSelector(selectStepPayload);

  const [selectedUseCase, setSelectedUseCase] = useState(null);

  // Debugging: Check karo data kis format mein aa raha hai
  console.log("Current Payload in UseCaseStep:", stepPayload);

   const useCases = Array.isArray(stepPayload) ? stepPayload : stepPayload?.useCases || [];

  const handleSubmit = () => {
    if (!selectedUseCase) return;

 dispatch(
      submitExploreStepThunk({
        sessionId,
        currentStep: "USE_CASE", // 🔥 IMPORTANT: Backend expects this
        stepData: {
          useCase: selectedUseCase,
        },
      })
    );
  };



  return (
 <div className="usecase-step">
      <h2>Select what you want help with</h2>

      {useCases.length === 0 && <p className="no-data">No options found for this selection.</p>}

      <div className="usecase-list">
        {useCases.map((useCase, index) => {
          // 2. Logic to handle both String and Object types
          const isObject = typeof useCase === 'object' && useCase !== null;
          
          // Agar string hai toh wahi value hai, agar object hai toh property nikalo
          const value = isObject ? (useCase.id || useCase.value) : useCase;
          const label = isObject ? (useCase.label || useCase.title) : useCase;

          return (
            <button
              key={value || index} // ✅ Fixed "Key" warning
              className={`usecase-btn ${selectedUseCase === value ? "active" : ""}`}
              onClick={() => setSelectedUseCase(value)}
            >
              {label} {/* ✅ Fixed blank button text */}
            </button>
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
  )
}

export default UseCaseStep