import React, { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2'

const TodoListInput = ({ todoList, setTodoList }) => {
    const [option, setOption] = useState('');

    const handleAddOption = () => {
        if(option.trim()) {
            setTodoList([...todoList, option.trim()]);
            setOption('');
        }
    }

    const handleDeleteOption = (index) => {
        const updatesArr = todoList.filter((_, idx) => idx !== index);
        setTodoList(updatesArr);
    }
    
  return (
    <div>
        {todoList.map((item, index) => (
            <div key={index} className='flex justify-between bg-gray-50 border border-gray-100 rounded-md px-3 py-2 mb-3 mt-2`'>
                <p className='text-xs text-black'>
                    <span className='text-gray-500 text-xs font-semibold mr-2'>
                        {index < 9 ? `0${index + 1}` : index + 1}
                    </span> 
                    {item}
                </p>

                <button
                    className='cursor-pointer'
                    onClick={() => handleDeleteOption(index)}
                >
                    <HiOutlineTrash className='text-lg text-red-500' />
                </button>
            </div>
        ))}

        <div className='flex items-center gap-5 mt-4'>
            <input 
                type='text' 
                className='w-full text-[13px] text-black outline-none bg-white border border-gray-100 rounded-md px-3 py-2' 
                placeholder='Add a task' 
                value={option} 
                onChange={(e) => setOption(e.target.value)} 
            />

            <button className='card-btn text-nowrap' onClick={handleAddOption}>
                <HiMiniPlus className='text-lg' /> Add Task
            </button>
        </div>
    </div>
  )
}

export default TodoListInput