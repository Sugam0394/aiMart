 import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { submitExploreStepThunk } from '../../../app/exploreFeatures/exploreThunks';
import { selectStepPayload, selectExploreSessionId } from '../../../app/exploreFeatures/exploreSelectors';
import SelectionOption from './components/SelectionOption';

function TaskStep() {
  const dispatch = useDispatch();
  const sessionId = useSelector(selectExploreSessionId);
  const stepPayload = useSelector(selectStepPayload); // Backend se tasks array aayega
  const [selectedTask, setSelectedTask] = useState(null);

  const tasks = Array.isArray(stepPayload) ? stepPayload : [];

  const handleSubmit = () => {
    if (!selectedTask) return;
    dispatch(
      submitExploreStepThunk({
        sessionId,
        currentStep: "TASK",
        stepData: { task: selectedTask },
      })
    );
  };

  if (tasks.length === 0) return <p>No tasks found for this role. Try going back.</p>;

  return (
    <div className="usecase-step">
      <h2 className="step-title">What do you want to achieve?</h2>
      <div className="usecase-grid">
        {tasks.map((task, index) => (
          <SelectionOption
            key={task || index}
            // "pitch-deck" ko "Pitch Deck" bana dega
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