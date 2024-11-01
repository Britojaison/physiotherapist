import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CategoryDropdown from './CategoryDropdown';
import { saveProgram, fetchSavedPrograms } from '../api';
import './ExerciseList.css';
import Notes from './Notes';

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

    const handleSideChange = (newSide) => {
        handleParamChange(index, 'side', newSide);
    };

    return (
        <div ref={(node) => ref(drop(node))} className="exercise-params">
            <label>Exercise: <strong>{exercise.name}</strong></label>
            <label>Sets:
                <input type="number" value={exercise.sets} onChange={(e) => handleParamChange(index, 'sets', e.target.value)} min="1" />
            </label>
            <label>Reps:
                <input type="number" value={exercise.reps} onChange={(e) => handleParamChange(index, 'reps', e.target.value)} min="1" />
            </label>
            <label>Hold Time (sec):
                <input type="number" value={exercise.holdTime} onChange={(e) => handleParamChange(index, 'holdTime', e.target.value)} min="0" />
            </label>
            <label>Side:
                <div className="toggle-slider">
                    <input
                        type="radio"
                        id={`left-${index}`}
                        name={`side-${index}`}
                        value="Left"
                        checked={exercise.side === 'Left'}
                        onChange={() => handleSideChange('Left')}
                    />
                    <label htmlFor={`left-${index}`} className="toggle-label">Left</label>

                    <input
                        type="radio"
                        id={`right-${index}`}
                        name={`side-${index}`}
                        value="Right"
                        checked={exercise.side === 'Right'}
                        onChange={() => handleSideChange('Right')}
                    />
                    <label htmlFor={`right-${index}`} className="toggle-label">Right</label>

                    <div className="toggle-button"></div>
                </div>
            </label>
            <button onClick={() => handleDuplicate(index)}>Duplicate</button>
            <button onClick={() => handleDelete(index)}>Delete</button>
        </div>
    );
}

function WeekdaysSelector({ selectedDays, onDaySelect, toggleAllDays }) {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Abbreviated day initials

    return (
        <div className="days-selector">
            <button className="select-all-button" onClick={toggleAllDays}>
                {selectedDays.length === 7 ? 'Unselect All' : 'Select All'}
            </button>
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

function ExerciseList() {
    const [exercises, setExercises] = useState([]);
    const [savedCombos, setSavedCombos] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);

    useEffect(() => {
        loadSavedCombos();
    }, []);

    const loadSavedCombos = async () => {
        try {
            const fetchedCombos = await fetchSavedPrograms();
            setSavedCombos(fetchedCombos || []); // Fallback to empty array
        } catch (error) {
            console.error('Failed to load saved combos:', error);
            setSavedCombos([]); // Ensure empty array on error
        }
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
                    side: 'Left',
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
        duplicateExercise.side = duplicateExercise.side === 'Left' ? 'Right' : 'Left';
        setExercises((prevExercises) => [...prevExercises, duplicateExercise]);
    };

    const handleDelete = (index) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const moveExercise = (fromIndex, toIndex) => {
        const updatedExercises = [...exercises];
        const [movedExercise] = updatedExercises.splice(fromIndex, 1);
        updatedExercises.splice(toIndex, 0, movedExercise);
        setExercises(updatedExercises);
    };

    const handleDaySelect = (dayIndex) => {
        setSelectedDays((prevSelectedDays) =>
            prevSelectedDays.includes(dayIndex)
                ? prevSelectedDays.filter((day) => day !== dayIndex)
                : [...prevSelectedDays, dayIndex]
        );
    };

    const toggleAllDays = () => {
        setSelectedDays(selectedDays.length === 7 ? [] : [0, 1, 2, 3, 4, 5, 6]);
    };

    const handleSaveCombo = async () => {
        await saveProgram({ exercises, days: selectedDays });
        alert('Combo saved successfully!');
        loadSavedCombos();
    };

    const handleClearAll = () => {
        setExercises([]);
        setSelectedDays([]);
    };
    const [sessions, setSessions] = useState(10);

    const handleDecrement = () => {
        if (sessions > 0) {
            setSessions(sessions - 1);
        }
    };

    // Function to handle increment
    const handleIncrement = () => {
        setSessions(sessions + 1);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <CategoryDropdown onExerciseSelect={handleAddExercise} />

            <h3>Exercise Parameters</h3>
            <div className="container">
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
            </div>
            <hr />
            <div className="schedule-container">
                <div>
                    <h3 className='select-days'>Days of Week</h3>
                    <WeekdaysSelector selectedDays={selectedDays} onDaySelect={handleDaySelect} toggleAllDays={toggleAllDays} />
                </div>

                <div className="daily-frequency">
                    <h3 className="label">Daily Frequency</h3>
                    <div className="frequency-controls">
                        <button className="decrement" onClick={handleDecrement}>-</button>
                        <span className="frequency">{sessions}</span>
                        <button className="increment" onClick={handleIncrement}>+</button> sessions/day
                    </div>
                </div>
            </div>
            <Notes />

            <button onClick={handleSaveCombo} style={{ marginRight: '.5rem' }}>Save as Combo</button>
            <button className="clear-button" onClick={handleClearAll}>Clear All</button>


            <h3>Saved Combos</h3>
            <div className="saved-combos">
                <ul>
                    {savedCombos && savedCombos.length > 0 ? (
                        savedCombos.map((combo, idx) => (
                            <li key={idx}>
                                Combo {idx + 1}: {combo.exercises ? combo.exercises.map((ex) => ex.name).join(', ') : 'No exercises'}
                            </li>
                        ))
                    ) : (
                        <p>No combos saved.</p>
                    )}
                </ul>
            </div>
        </DndProvider>
    );
}

export default ExerciseList;
