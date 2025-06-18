import React from 'react'

const Progress = ({ progress, status }) => {
  // Get color based on task status
  const getColor = () => {
    switch (status) {
      case 'In Progress':
        return 'bg-orange-500 text-orange-800 border border-orange-200/10 shadow-orange-100/50'
      case 'Completed':
        return 'bg-green-500 text-green-800 border border-green-200/10 shadow-green-100/50'
      default:
        return 'bg-red-500 text-red-800 border border-red-200/10 shadow-red-100/50'
    }
  }

  // Ensure progress is between 0 and 1, then convert to percentage
  const clampedProgress = Math.min(Math.max(progress || 0, 0), 1) * 100;

  return (
    <div className='w-full bg-gray-200 rounded-full h-1.5 mt-1'>
      <div
        className={`${getColor()} h-1.5 rounded-full transition-all duration-300`}
        style={{ width: `${clampedProgress}%` }}
      ></div>
    </div>
  )
}

export default Progress
