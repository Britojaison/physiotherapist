import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'EXERCISE';

function DraggableExercise({ exercise, index, moveExercise, handleDuplicate, handleDelete, handleParamChange }) {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveExercise(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="exercise-params">
      <label>
        Exercise: <strong>{exercise.name}</strong>
      </label>
      <label>
        Sets:
        <input
          type="number"
          value={exercise.sets}
          onChange={(e) => handleParamChange(index, 'sets', e.target.value)}
          min="1"
        />
      </label>
      <label>
        Reps:
        <input
          type="number"
          value={exercise.reps}
          onChange={(e) => handleParamChange(index, 'reps', e.target.value)}
          min="1"
        />
      </label>
      <label>
        Hold Time (sec):
        <input
          type="number"
          value={exercise.holdTime}
          onChange={(e) => handleParamChange(index, 'holdTime', e.target.value)}
          min="0"
        />
      </label>
      <label>
        Side:
        <select
          value={exercise.side}
          onChange={(e) => handleParamChange(index, 'side', e.target.value)}
        >
          <option value="Left">Left</option>
          <option value="Right">Right</option>
          <option value="Both">Both</option>
        </select>
      </label>
      <button onClick={() => handleDuplicate(index)}>Duplicate</button>
      <button onClick={() => handleDelete(index)}>Delete</button> 
    </div>
  );
}

export default DraggableExercise;
