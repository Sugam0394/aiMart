 import React from 'react'
 import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './styles/Explore.css'  
import StepFlowController from './StepFlowController'
import { resetExplore } from '../../app/exploreFeatures/exploreSlice'
 

function Explore() {

const dispatch = useDispatch();
 
  useEffect(() => {
    dispatch(resetExplore());
  }, [dispatch]);









  return (
 
    <main className="explore-layout"> 
      <div className="explore-container">
        
   
        
        <StepFlowController /> 
        
      </div>
     
    </main>
  )
}

export default Explore