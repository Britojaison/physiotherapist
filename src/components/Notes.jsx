import React from 'react';
import './Notes.css'

function Notes() {
  return (
    <div>
      <label className='label-note'>Therapist Notes:</label>
      <textarea className='textarea-note' rows="4" cols="50" placeholder="Enter notes here..." />
    </div>
  );
}

export default Notes;
