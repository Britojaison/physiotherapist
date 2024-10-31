// src/components/ExerciseList.jsx
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CategoryDropdown from './CategoryDropdown';
import { saveProgram, fetchSavedPrograms } from '../api';

const ItemType = 'EXERCISE';

function DraggableExercise({ exercise, index, moveExercise, handleDuplicate, handleParamChange, handleDelete }) {
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

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [savedCombos, setSavedCombos] = useState([]);

  useEffect(() => {
    loadSavedCombos();
  }, []);

  const loadSavedCombos = async () => {
    const savedCombos = await fetchSavedPrograms();
    setSavedCombos(savedCombos);
  };

  const handleAddExercise = (selectedExercise) => {
    if (selectedExercise) {
      setExercises((prevExercises) => [
        ...prevExercises,
        {
          name: selectedExercise,
          sets: 3,
          reps: 10,
          holdTime: 5,
          side: 'Both',
        },
      ]);
    }
  };

  const handleParamChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const handleDuplicate = (index) => {
    const duplicateExercise = { ...exercises[index] };
    if (duplicateExercise.side === 'Left') duplicateExercise.side = 'Right';
    else if (duplicateExercise.side === 'Right') duplicateExercise.side = 'Left';

    setExercises((prevExercises) => [...prevExercises, duplicateExercise]);
  };

  const handleDelete = (index) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  const moveExercise = (fromIndex, toIndex) => {
    const updatedExercises = [...exercises];
    const [movedExercise] = updatedExercises.splice(fromIndex, 1);
    updatedExercises.splice(toIndex, 0, movedExercise);
    setExercises(updatedExercises);
  };

  const handleSaveCombo = async () => {
    await saveProgram(exercises);
    alert('Combo saved successfully!');
    loadSavedCombos(); // Reload saved combos after saving
  };

  const handleClearAll = () => {
    setExercises([]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <CategoryDropdown onExerciseSelect={handleAddExercise} />

      <h3>Exercise Parameters</h3>
      {exercises.map((exercise, index) => (
        <DraggableExercise
          key={index}
          index={index}
          exercise={exercise}
          moveExercise={moveExercise}
          handleDuplicate={handleDuplicate}
          handleDelete={handleDelete}
          handleParamChange={handleParamChange}
        />
      ))}
      <button onClick={handleSaveCombo}>Save as Combo</button>
      <button onClick={handleClearAll}>Clear All</button>

      <h3>Saved Combos</h3>
      <ul>
        {savedCombos.map((combo, idx) => (
          <li key={idx}>
            Combo {idx + 1}: {combo.map((ex) => ex.name).join(', ')}
          </li>
        ))}
      </ul>
    </DndProvider>  
  );
}

export default ExerciseList;
