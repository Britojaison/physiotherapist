import React from 'react';

function FrequencySettings() {
  return (
    <div>
      <label>Days of the Week:</label>
      {/* Checkboxes for each day */}
      <label>Sessions per Day:</label>
      <input type="number" min="1" max="5" />
    </div>
  );
}

export default FrequencySettings;
