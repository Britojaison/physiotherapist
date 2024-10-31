import React, { useState } from 'react';
import './CategoryDropdown.css';
import ExerciseList from './ExerciseList';

const bodyParts = [
  {
    category: 'Lower Body',
    exercises: ['Squats', 'Lunges', 'Leg Raises'],
  },
  {
    category: 'Upper Body',
    exercises: ['Push Ups', 'Bicep Curls', 'Shoulder Press'],
  },
  {
    category: 'Core',
    exercises: ['Plank', 'Russian Twists', 'Bicycle Crunches'],
  },
];

function CategoryDropdown() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleCategoryHover = (category) => {
    setSelectedCategory(category);
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setSelectedCategory(null); // Hide the dropdown once an exercise is selected
  };

  return (
    <div>
      <label>Choose Body Part Category:</label>
      <div className="dropdown">
        {/* Display selected exercise if it exists, otherwise show dropdown */}
        {selectedExercise ? (
          <div className="selected-exercise">{selectedExercise}</div>
        ) : (
          bodyParts.map((part) => (
            <div
              key={part.category}
              onMouseEnter={() => handleCategoryHover(part)}
              className="dropdown-item"
            >
              {part.category}
              {selectedCategory === part && (
                <div className="submenu">
                  {part.exercises.map((exercise) => (
                    <div
                      key={exercise}
                      className="submenu-item"
                      onClick={() => handleExerciseSelect(exercise)}
                    >
                      {exercise}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Show ExerciseList component once an exercise is selected */}
      {selectedExercise && <ExerciseList selectedExercise={selectedExercise} />}
    </div>
  );
}

export default CategoryDropdown;
