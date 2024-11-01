import React, { useState } from 'react';
import './ExerciseList.css';

function WeekdaysSelector({ selectedDays, onDaySelect }) {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Abbreviated day initials

    return (
        <div className="days-selector">
            {days.map((day, index) => (
                <div
                    key={index}
                    className={`day-circle ${selectedDays.includes(index) ? 'selected' : ''}`}
                    onClick={() => onDaySelect(index)}
                >
                    {day}
                </div>
            ))}
        </div>
    );
}

export default WeekdaysSelector;
