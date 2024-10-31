import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableExercise from './DraggableExercise'; // Make sure to import the DraggableExercise component

function ExerciseList({ selectedExercise }) {
  const [exercises, setExercises] = useState([]);
  const [savedCombos, setSavedCombos] = useState([]);

  // Update exercises list when selectedExercise changes
  useEffect(() => {
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
  }, [selectedExercise]);

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

  const moveExercise = (fromIndex, toIndex) => {
    const updatedExercises = [...exercises];
    const [movedExercise] = updatedExercises.splice(fromIndex, 1);
    updatedExercises.splice(toIndex, 0, movedExercise);
    setExercises(updatedExercises);
  };

  const handleSaveCombo = () => {
    setSavedCombos((prevCombos) => [...prevCombos, exercises]);
    alert('Combo saved successfully!');
  };

  const handleClearAll = () => {
    setExercises([]);
  };

  const handleDelete = (index) => {
    setExercises((prevExercises) => prevExercises.filter((_, i) => i !== index));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <h3>Exercise Parameters</h3>
      {exercises.map((exercise, index) => (
        <DraggableExercise
          key={index}
          index={index}
          exercise={exercise}
          moveExercise={moveExercise}
          handleDuplicate={handleDuplicate}
          handleDelete={handleDelete} // Pass handleDelete function
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
