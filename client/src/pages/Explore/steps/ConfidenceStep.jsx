import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks'
import { selectStepPayload , selectExploreSessionId } from '../../../app/exploreFeatures/exploreSelectors';
import "./styles/ConfidenceStep.css";
function ConfidenceStep() {
 const dispatch = useDispatch();
  const sessionId = useSelector(selectExploreSessionId);
  const stepPayload = useSelector(selectStepPayload); // Isme summary data hona chahiye

  const handleConfirm = () => {
    dispatch(
      submitExploreStepThunk({
        sessionId,
        currentStep: "CONFIDENCE",
        stepData: { confidenceScore: 5 }, // Dummy score for now
      })
    );
  };


  return (
     <div className="explore-step confidence-step">
      <h2>You're all set 🚀</h2>
      <div className="summary">
        {/* Backend se aaya hua summary display karo */}
        <p><strong>Intent:</strong> {stepPayload?.intent || "Selected"}</p>
        <p><strong>Use Case:</strong> {stepPayload?.useCase || "Selected"}</p>
      </div>
      <button onClick={handleConfirm}>Confirm & Continue</button>
    </div>
  )
}

export default ConfidenceStep