 import { useState } from 'react'
import "./styles/StepFlowController.css"
import IntentStep from './steps/IntentStep'
import UseCaseStep from './steps/UseCaseStep'
import ToolStep from './steps/ToolStep'
import ConfidenceStep from './steps/ConfidenceStep'

const STEPS = [IntentStep, UseCaseStep, ToolStep, ConfidenceStep];

function StepFlowController() {
  const [currentStep, setCurrentStep] = useState(0);
  const ActiveStep = STEPS[currentStep];

  const handleNext = () => {
setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
};

  return (
     <div className="step-flow-container">
<ActiveStep />


{/* Dummy navigation — no backend */}
<div className="step-navigation">
<button
className="primary-btn"
onClick={handleNext}
disabled={currentStep === STEPS.length - 1}
>
Next
</button>
</div>
</div>
  )
}

export default StepFlowController

 