import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startExploreThunk } from '../../app/exploreFeatures/exploreThunks';
import { jumpToStep } from '../../app/exploreFeatures/exploreSlice';
import StepShell from './StepShell';
import "./styles/StepFlowController.css";

import { 
  selectCurrentStep, 
  selectExploreError, 
  selectExploreLoading,
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
  const selections = useSelector((state) => state.explore.selections);

  useEffect(() => {
    // Fresh session start logic
    if (!currentStep && !loading && !error) {
      dispatch(startExploreThunk());
    }
  }, [dispatch, currentStep, loading, error]); 

  // 1. Initial Loading State
  if (loading && !currentStep) {
    return (
      <div className="explore-loader-container">
        <div className="ai-pulse-loader"></div>
        <p>Initializing AI Mart Explore...</p>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="step-error-card">
        <div className="error-icon">⚠️</div>
        <h3>System Interruption</h3>
        <p className="error-msg">{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  // 3. Normalized Step Rendering
  const step = currentStep?.toUpperCase();

  return (
    <div className="step-flow-wrapper">
      {/* --- STEP 1: INTENT --- */}
      <StepShell 
        stepNumber="1"
        title="What's your goal?"
        isCompleted={step !== 'INTENT'}
        isLocked={false}
        summaryValue={selections.intent}
        onEdit={() => dispatch(jumpToStep('INTENT'))}
      >
        <IntentStep />
      </StepShell>

      {/* --- STEP 2: USE CASE --- */}
      <StepShell 
        stepNumber="2"
        title="What exactly do you need?"
        isCompleted={step === 'TOOLS' || step === 'CONFIDENCE'}
        isLocked={step === 'INTENT'}
        summaryValue={selections.useCase}
        onEdit={() => dispatch(jumpToStep('USE_CASE'))}
      >
        <UseCaseStep />
      </StepShell>

      {/* --- STEP 3: TOOLS --- */}
      <StepShell 
        stepNumber="3"
        title="Recommended Tools"
        isCompleted={step === 'CONFIDENCE'}
        isLocked={step === 'INTENT' || step === 'USE_CASE'}
      >
        <ToolStep />
      </StepShell>

      {/* --- FINAL STEP: CONFIDENCE (Optional Popup/Section) --- */}
      {step === 'CONFIDENCE' && (
        <div className="final-confirmation-area">
          <ConfidenceStep />
        </div>
      )}

      {step === 'COMPLETED' && (
        <div className="explore-success-screen">
          <h2>Mission Accomplished! 🚀</h2>
          <p>Your workspace is ready with selected tools.</p>
        </div>
      )}
    </div>
  );
}

export default StepFlowController; 

 