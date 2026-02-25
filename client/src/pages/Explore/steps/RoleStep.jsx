 import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { submitExploreStepThunk, startExploreThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectExploreSessionId } from '../../../app/exploreFeatures/exploreSelectors';
import SelectionOption from './components/SelectionOption';
import "./styles/RoleStep.css"; // Ensure this import exists

const ROLES = [
  { id: 'founder', label: 'Founder 🚀', desc: 'Building the next big thing' },
  { id: 'marketer', label: 'Marketer 📢', desc: 'Growth and distribution' },
  { id: 'designer', label: 'Designer 🎨', desc: 'Visuals and UI/UX' },
  { id: 'developer', label: 'Developer 💻', desc: 'Code and automation' },
  { id: 'creator', label: 'Creator 🤳', desc: 'Content and community' }
];

function RoleStep() {
  const dispatch = useDispatch();
  const sessionId = useSelector(selectExploreSessionId);

  const handleRoleSelect = async (roleId) => {
    let currentSessionId = sessionId;

    if (!currentSessionId) {
      const result = await dispatch(startExploreThunk());
      if (startExploreThunk.fulfilled.match(result)) {
        currentSessionId = result.payload.sessionId;
      } else {
        return; // Silent fail or system toast
      }
    }

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
          <div 
            key={role.id} 
            className="role-card-wrapper" 
            onClick={() => handleRoleSelect(role.id)}
          >
             {/* SelectionOption must handle the #FFFFFF card background internally */}
             <SelectionOption 
                label={role.label}
                isSelected={false} 
             />
             <p className="role-desc">
                {role.desc}
             </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoleStep;