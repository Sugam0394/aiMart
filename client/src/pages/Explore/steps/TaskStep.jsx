 import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectStepPayload, selectExploreSessionId } from '../../../app/exploreFeatures/exploreSelectors';
import SelectionOption from './components/SelectionOption';
import "./styles/TaskStep.css"; // Critical import

function TaskStep() {
  const dispatch = useDispatch();
  const sessionId = useSelector(selectExploreSessionId);
  const stepPayload = useSelector(selectStepPayload); 
  const [selectedTask, setSelectedTask] = useState(null);

  const tasks = Array.isArray(stepPayload) ? stepPayload : [];

  const handleSubmit = () => {
    if (!selectedTask || !sessionId) return;
    dispatch(
      submitExploreStepThunk({
        sessionId,
        currentStep: "TASK",
        stepData: { task: selectedTask },
      })
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="step-error-card">
        <p className="error-msg">No tasks found. Please go back and re-select your role.</p>
      </div>
    );
  }

  return (
    <div className="usecase-step">
      <h2 className="step-title">Select your priority task:</h2>
      
      <div className="usecase-grid">
        {tasks.map((task, index) => (
          <SelectionOption
            key={task || index}
            label={task.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            isSelected={selectedTask === task}
            onClick={() => setSelectedTask(task)}
          />
        ))}
      </div>

      <button
        className="primary-action-btn"
        onClick={handleSubmit}
        disabled={!selectedTask}
      >
        Find Best AI Tools →
      </button>
    </div>
  );
}

export default TaskStep;