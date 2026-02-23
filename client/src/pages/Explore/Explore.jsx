 import React from 'react'
import './styles/Explore.css'
// import ExploreWrapper from './ExploreWrapper' // Ise hata dein
import StepFlowController from './StepFlowController' // Ise use karein

function Explore() {
  return (
    <main className="explore-layout">
      <div className="explore-container">
        {/* ✅ FIXED: ExploreWrapper ki jagah StepFlowController use karein */}
        <StepFlowController /> 
      </div>
    </main>
  )
}

export default Explore