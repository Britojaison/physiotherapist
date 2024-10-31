import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ExerciseAssignment from './pages/ExerciseAssignment';
import ExerciseList from './components/ExerciseList';

function App() {

  return (
    <>
    <h1>Physiotherapy Exercise Planner</h1>
    <ExerciseList />
      
    </>
  )
}

export default App
