import React from 'react'
import Progress from '../Progress'
import AvatarGroup from '../AvatarGroup'
import {LuPaperclip} from 'react-icons/lu'
import moment from 'moment'


const TaskCard = ({
    title,
    description,
    priority,
    status,
    progress,
    createdAt,
    dueDate,
    assignedTo,
    attachmentCount,
    completedTodoCount,
    todoChecklist,
    onClick
}) => {

    const getStatusTagColor = () => {
        switch (status) {
            case 'inProgress':
                return 'bg-orange-100 text-orange-800 border border-orange-200/10 shadow-orange-100/50'
            case 'completed':
                return 'bg-green-100 text-green-800 border border-green-200/10 shadow-green-100/50'
            default:
                return 'bg-red-100 text-red-800 border border-red-200/10 shadow-red-100/50'
        }
    }

    const getPriorityTagColor = () => {
        switch (priority) {
            case 'Low':
                return 'text-emerald-500 bg-emerald-50 border border-emerald-200/10 shadow-emerald-100/50'
            case 'Medium':
                return 'text-amber-500 bg-amber-50 border border-amber-200/10 shadow-amber-100/50'
            default:
                return 'text-rose-500 bg-rose-50 border border-rose-200/10 shadow-rose-100/50'
        }
    }

  return <div className='bg-white rounded-lg shadow-md p-4 cursor-pointer border border-gray-200 flex flex-col gap-2' onClick={onClick}>
    <div className='flex justify-between items-center'>
        <div className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
            {status}
        </div>

        <div className='flex items-center gap-2'>
            <div className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}>
                {priority} Priority
            </div>
        </div>
    </div>
    <div className='flex flex-col gap-2'>
        <div className={`px-4 border-l-[3px] ${
            status === 'In Progress' ? 'border-orange-500' : status === 'Completed' ? 'border-green-500' : 'border-red-500'
        }`}>
            <p className='text-sm font-medium text-gray-800 mt-4 line-clamp-2'>
                {title} 
            </p>

            <p className='text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]'>
                {description}
            </p>

            <p className='text-[13px] mt-4 flex items-center gap-1 text-gray-500 font-medium leading-[18px]'>
                Task Done: {" "}
                <span className='text-gray-800 text-[12px] font-medium leading-[18px]'>
                    {completedTodoCount}/{todoChecklist?.length}
                </span>
            </p>
            <Progress progress={progress} status={status} />
        </div>
            <div className='flex justify-between items-center gap-2'>
                <div className='flex flex-col gap-1'>
                    <label className='text-[11px] text-gray-500 font-medium'>
                        Start Date
                    </label>
                    <p className='text-[13px] text-gray-800 font-medium'>
                        {moment(createdAt).format('Do MMM YYYY')}
                    </p>
                </div>

                <div className='flex flex-col gap-1'>
                    <label className='text-[11px] text-gray-500 font-medium'>
                        Due Date
                    </label>
                    <p className='text-[13px] text-gray-800 font-medium'>
                        {moment(dueDate).format('Do MMM YYYY')}
                    </p>
                </div>
            </div>
        <div className='flex items-center justify-between gap-2'>
                <AvatarGroup
                    avatars={assignedTo || []}
                />
                {attachmentCount > 0 && (
                    <div className='flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg'>
                        <LuPaperclip className='text-primary' /> {" "}
                        <span className='text-gray-800 font-medium'>{attachmentCount}</span>
                    </div>
                )}
        </div>
    </div>
  </div>
}

export default TaskCard