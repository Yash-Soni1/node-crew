import React from 'react'

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className='my-2'>
      <div className='flex'>
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`relative px-3 md:px-4 py-2 text-sm font-medium ${
              activeTab === tab.label
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
            } cursor-pointer`}
            onClick={() => setActiveTab(tab.label)}
          >
            <div className='flex items-center'>
              <span className='text-xs'>{tab.label}</span>
            </div>

            {activeTab === tab.label && (
              <div className='absolute bottom-0 left-0 w-full h-[2px] bg-primary' />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaskStatusTabs
