 import React from 'react'
import './styles/Explore.css'  
import StepFlowController from './StepFlowController'
 

function Explore() {
  return (
 
    <main className="explore-layout"> 
      <div className="explore-container">
        
   
        
        <StepFlowController /> 
        
      </div>
      
      {/* Tip: Agar aapke StepFlowController mein buttons hain, 
        to ensure karein unme 'primary-action-btn' ya 'usecase-btn' 
        classes use ho rahi hain.
      */}
    </main>
  )
}

export default Explore