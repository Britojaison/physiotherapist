import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../api.js';

import './CategoryDropdown.css'

function CategoryDropdown({ onExerciseSelect }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();

    console.log("Fetched categories:", data)
      setCategories(data);
    };
    getCategories();
  }, []);

  const handleCategoryHover = (category) => {
    setSelectedCategory(category);
  };

  const handleExerciseSelect = (exercise) => {
    onExerciseSelect(exercise);
    setSelectedCategory(null);
  };

  return (
    <div>
      <label>Choose Body Part Category:</label>
      <div className="dropdown">
        {categories.map((part) => (
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
        ))}
      </div>
    </div>
  );
}

export default CategoryDropdown;
