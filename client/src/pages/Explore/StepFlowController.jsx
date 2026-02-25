 import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startExploreThunk } from '../../app/exploreFeatures/exploreThunks';
import { jumpToStep } from '../../app/exploreFeatures/exploreSlice';
import StepShell from './StepShell';
import RoleStep from './steps/RoleStep';
 import TaskStep from './steps/TaskStep';
import ToolStep from './steps/ToolStep';
import './styles/StepFlowController.css';

function StepFlowController() {
  const dispatch = useDispatch();
   // 1. Yahan 'exploreSessionId' ko extract karo (kyunki slice mein yahi naam hai)
  const { exploreSessionId, currentStep, selections, loading, error } = useSelector((state) => state.explore);

  useEffect(() => {
    // 2. Variable name match karo 'exploreSessionId'
    if (!exploreSessionId && !loading) {
      dispatch(startExploreThunk());
    }
  }, [dispatch, exploreSessionId, loading]);// currentStep ki jagah sessionId monitor karo

  if (loading && !currentStep) return <div className="ai-pulse-loader">Preparing AI Mart...</div>;
  if (error) return <div className="error-card">{error}</div>;

  

  const step = currentStep?.toUpperCase();

 

  return (
    <div className="step-flow-wrapper">
      {/* STEP 1: ROLE */}
      <StepShell 
        stepNumber="1"
        title="Who are you?"
        isCompleted={step !== 'ROLE'}
        summaryValue={selections.role}
        onEdit={() => dispatch(jumpToStep('ROLE'))}
      >
        <RoleStep />
      </StepShell>

      {/* STEP 2: TASK */}
     {/* STEP 2: TASK */}
<StepShell 
  stepNumber="2"
  title="What's your priority?"
  
  isCompleted={['TOOLS', 'RESULTS', 'COMPLETED'].includes(step)}
  isLocked={step === 'ROLE'}
  summaryValue={selections.task}
  onEdit={() => dispatch(jumpToStep('TASK'))}
>
  <TaskStep />
</StepShell>

      {/* STEP 3: TOOLS */}
      <StepShell 
        stepNumber="3"
        title="Select your AI Stack"
        isCompleted={false}
        isLocked={step === 'ROLE' || step === 'TASK'}
      >
        <ToolStep />
      </StepShell>
    </div>
  );
}

export default StepFlowController;

 