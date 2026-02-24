 import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { submitExploreStepThunk , startExploreThunk } from '../../../app/exploreFeatures/exploreThunks';
// Selector ka naam check karo: selectExploreSessionId hi hai na?
import { selectExploreSessionId } from '../../../app/exploreFeatures/exploreSelectors';
import SelectionOption from './components/SelectionOption'; 

const ROLES = [
  { id: 'founder', label: 'Founder 🚀', desc: 'Building the next big thing' },
  { id: 'marketer', label: 'Marketer 📢', desc: 'Growth and distribution' },
  { id: 'designer', label: 'Designer 🎨', desc: 'Visuals and UI/UX' },
  { id: 'developer', label: 'Developer 💻', desc: 'Code and automation' },
  { id: 'creator', label: 'Creator 🤳', desc: 'Content and community' }
];

function RoleStep() {
  const dispatch = useDispatch();
  
  // 1. Yahan dhyan do: Kya sessionId mil raha hai?
  const sessionId = useSelector(selectExploreSessionId);

  // RoleStep.jsx
const handleRoleSelect = async (roleId) => {
  let currentSessionId = sessionId;

  // 1. Agar session null hai (race condition), toh wait karo ya create karo
  if (!currentSessionId) {
    console.log("Session missing... creating now...");
    const result = await dispatch(startExploreThunk());
    
    // Agar thunk successful raha, toh nayi ID nikaalo
    if (startExploreThunk.fulfilled.match(result)) {
      currentSessionId = result.payload.sessionId;
    } else {
      alert("Please wait, AI Mart is initializing...");
      return;
    }
  }

  // 2. Guaranteed Session ID ke saath dispatch
  dispatch(submitExploreStepThunk({
    sessionId: currentSessionId,
    currentStep: "ROLE",
    stepData: { role: roleId },
  }));
};

  return (
    <div className="role-step-container">
      <div className="usecase-grid">
        {ROLES.map((role) => (
          <div key={role.id} className="role-card-wrapper" onClick={() => handleRoleSelect(role.id)}>
             <SelectionOption 
                label={role.label}
                isSelected={false} 
             />
             <p className="role-desc" style={{fontSize: '12px', color: '#888', marginTop: '5px'}}>
                {role.desc}
             </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoleStep;