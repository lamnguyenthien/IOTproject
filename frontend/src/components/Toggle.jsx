'use client'

import { useState } from 'react'

export default function ToggleButton({isToggled, handleToggle}) {

  return (
    <button
      onClick={handleToggle}
      className={`relative inline-flex items-center h-8 rounded-full w-16 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
        isToggled ? 'bg-blue-500' : 'bg-gray-500'
      }`}
      aria-pressed={isToggled}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
          isToggled ? 'translate-x-10' : 'translate-x-2'
        }`}
      />
    </button>
  )
}