import React, { useState } from 'react';
import ToggleButton from './Toggle';

const Switch = ({ title, icon, toggleState, handleToggle }) => {
  return (
    <div className="flex items-center justify-between h-1/3 gap-4">
      <div className="text-gray-800 text-[1.5rem] font-semibold flex gap-4 justify-center items-center">{icon} {title}</div>
      <label className="inline-block w-16 h-8">
        <ToggleButton isToggled={toggleState} handleToggle={handleToggle}/>
      </label>
    </div>
  );
};
export default Switch;