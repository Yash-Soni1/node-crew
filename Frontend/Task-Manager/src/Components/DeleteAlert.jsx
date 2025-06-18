import React from 'react'
import { LuTrash2 } from 'react-icons/lu'

const DeleteAlert = ({content, onDelete}) => {
  return (
    <div>
        <p className='text-sm text-white py-2'>{content}</p>
        <div className='flex gap-2'>
            <button type='button' className='flex items-center gap-2 bg-red-200 text-red-600 whitespace-nowrap px-4 py-2 rounded-md cursor-pointer border border-transparent  hover:border-red-500' onClick={onDelete}>
                <LuTrash2 className='w-4 h-4' />
                Delete
            </button>
        </div>
    </div>
  )
}

export default DeleteAlert