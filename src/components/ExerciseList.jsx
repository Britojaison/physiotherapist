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
        loadSavedCombos();
    };

    const handleClearAll = () => {
        setExercises([]);
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
            <button onClick={handleSaveCombo} style={{ marginRight: '.5rem' }}>Save as Combo</button>
            <button onClick={handleClearAll}>Clear All</button>

            <h3>Saved Combos</h3>
            <div className="saved-combos">
                <ul>
                    {savedCombos.map((combo, idx) => (
                        <li key={idx}>
                            Combo {idx + 1}: {combo.map((ex) => ex.name).join(', ')}
                        </li>
                    ))}
                </ul>
            </div>

        </DndProvider>
    );
}

export default ExerciseList;
