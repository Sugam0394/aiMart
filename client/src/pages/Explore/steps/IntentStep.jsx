import React from 'react'
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectExploreSessionId } from '../../../app/exploreFeatures/exploreSelectors';

import "./styles/IntentStep.css";


function IntentStep() {
 const dispatch = useDispatch();
  const sessionId = useSelector(selectExploreSessionId);

  const [intent, setIntent] = useState("");

  const handleSubmit = () => {
    if (!intent.trim()) return;

    dispatch(
      submitExploreStepThunk({
        sessionId,
        currentStep: "INTENT",
        stepData: {
          intent,
        },
      })
    );
  };









  return (
     <div className="intent-step">
      <h2>What do you want to do?</h2>

      <input
        type="text"
        placeholder="e.g. Study better, Build a website, Grow business"
        value={intent}
        onChange={(e) => setIntent(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={!intent.trim()}>
        Continue
      </button>
    </div>
  )
}

export default IntentStep