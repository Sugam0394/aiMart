 import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startExploreThunk } from '../../app/exploreFeatures/exploreThunks';
import StepShell from './StepShell';
import "./styles/StepFlowController.css";

import { 
  selectCurrentStep, 
  selectExploreError, 
  selectExploreLoading 
} from '../../app/exploreFeatures/exploreSelectors';

import IntentStep from './steps/IntentStep';
import UseCaseStep from './steps/UseCaseStep';
import ToolStep from './steps/ToolStep';
import ConfidenceStep from './steps/ConfidenceStep';

function StepFlowController() {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);
  const loading = useSelector(selectExploreLoading);
  const error = useSelector(selectExploreError);

  // Debugging logs
  console.log("StepFlowController Status:", { currentStep, loading, error });

  useEffect(() => {
    // 🔥 Sabse important check: Sirf tabhi dispatch karo agar pehle se koi step na ho
    // Isse infinite loop ruk jayega
    if (!currentStep && !loading && !error) {
      console.log("Effect Triggered! Starting fresh session...");
      dispatch(startExploreThunk());
    }
  }, [dispatch, currentStep, loading, error]); 

  // 1️⃣ Global loading state
  if (loading && !currentStep) {
    return <div className="step-loader">Initializing AI Mart Explore...</div>;
  }

  // 2️⃣ Global error state
  if (error) {
    return (
      <div className="step-error">
        <p>Arey! Kuch gadbad ho gayi.</p>
        <p className="error-msg">{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // 3️⃣ Backend-driven rendering
  // Backend se milne wale strings ko handle karna
  switch (currentStep) {
    case "INTENT":
      return  (
         <StepShell variant="intent">
      <IntentStep />
    </StepShell>
      )

    case "USE_CASE":
      return <StepShell variant="use-case"><UseCaseStep /></StepShell>;

    case "TOOLS": // 💡 Tip: Backend mein check karna "TOOL" hai ya "TOOLS"
    case "TOOL":
      return <StepShell variant="tools"><ToolStep /></StepShell>;
    case "CONFIDENCE":
      return <ConfidenceStep />;

    case "COMPLETED":
      return <div className="step-completed">Setup Finished! 🚀</div>;

    default:
      return (
        <div className="step-initial">
          <p>Preparing your workspace...</p>
        </div>
      );
  }
}

export default StepFlowController;

 