import React from 'react';
import CategoryDropdown from '../components/CategoryDropdown';
import ExerciseList from '../components/ExerciseList';
import FrequencySettings from '../components/FrequencySettings';
import Notes from '../components/Notes';

function ExerciseAssignment() {
  return (
    <div>
      <h1>Assign Exercises</h1>
      <CategoryDropdown />
      <ExerciseList />
      <FrequencySettings />
      <Notes />
    </div>
  );
}

export default ExerciseAssignment;
