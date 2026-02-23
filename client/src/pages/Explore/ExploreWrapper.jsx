 import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { startExploreThunk } from '../../app/exploreFeatures/exploreThunks';
import { jumpToStep } from '../../app/exploreFeatures/exploreSlice';
import StepShell from './StepShell';
import IntentStep from './steps/IntentStep';
import UseCaseStep from './steps/UseCaseStep';
import ToolStep from './steps/ToolStep';
import "./styles/ExploreWrapper.css";
import ExploreResult from './ExploreResult';

 function ExploreWrapper() {
  const dispatch = useDispatch();
  
  const exploreState = useSelector((state) => state.explore) || {};
  const { 
    currentStep = 'INTENT', 
    selections = {}, 
    loading = false
  } = exploreState;

  useEffect(() => {
    dispatch(startExploreThunk());
  }, [dispatch]);

  if (loading) return <div className="explore-loading">Loading...</div>;

  // ✅ Agar currentStep 'CONFIDENCE' hai, toh pura wizard hata kar Result dikhao
  if (currentStep === 'CONFIDENCE') {
    return <ExploreResult intent={selections.intent} />;
  }

  return (
    <div className="explore-container-main">
      {/* 1. INTENT STEP */}
      <StepShell 
        stepNumber="1"
        title="What's your goal?"
        isCompleted={currentStep !== 'INTENT'}
        isLocked={false} 
        summaryValue={selections.intent}
        onEdit={() => dispatch(jumpToStep('INTENT'))}
      >
        <IntentStep />
      </StepShell>

      {/* 2. USE CASE STEP */}
      <StepShell 
        stepNumber="2"
        title="What exactly do you need?"
        isCompleted={currentStep === 'TOOLS' || currentStep === 'CONFIDENCE'}
        isLocked={currentStep === 'INTENT'} 
        summaryValue={selections.useCase}
        onEdit={() => dispatch(jumpToStep('USE_CASE'))}
      >
        <UseCaseStep />
      </StepShell>

      {/* 3. TOOLS STEP */}
      <StepShell 
        stepNumber="3"
        title="Recommended Tools"
        isCompleted={currentStep === 'CONFIDENCE'}
        isLocked={currentStep === 'INTENT' || currentStep === 'USE_CASE'}
      >
        <ToolStep />
      </StepShell>
    </div>
  );
}

export default ExploreWrapper;