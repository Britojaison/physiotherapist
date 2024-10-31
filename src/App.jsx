import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ExerciseList from './components/ExerciseList';
import Notes from './components/Notes';

function App() {

  return (
    <>
    <h1>Physiotherapy Exercise Planner</h1>
    <ExerciseList />
    <Notes />
      
    </>
  )
}

export default App
