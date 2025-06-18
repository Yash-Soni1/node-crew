import React, { useState } from 'react'
import {HiMiniPlus, HiOutlineTrash} from 'react-icons/hi2';
import {LuPaperclip} from 'react-icons/lu';

const AddAttachmentsInput = ({attachments, setAttachments}) => {
    const [option, setOption] = useState('');

    const handleAddOption = () => {
        if(option.trim()) {
            setAttachments([...attachments, option.trim()]);
            setOption('');
        }
    }

    const handleDeleteOption = (index) => {
        const updatesArr = attachments.filter((_, idx) => idx !== index);
        setAttachments(updatesArr);
    }
        
  return (
        <div>
            {attachments.map((item, index) => (
                <div key={index} className='flex justify-between bg-gray-50 border border-gray-100 rounded-md px-3 py-2 mb-3 mt-2'>
                    <div className='flex-1 flex items-center gap-3 border border-gray-100'>
                        <LuPaperclip className='text-gray-400' />
                        <p className='text-xs text-black'>{item}</p>
                    </div>

                    <button className='cursor-pointer' onClick={() => handleDeleteOption(index)}>
                        <HiOutlineTrash className='text-red-500 text-lg' />
                    </button>
                </div>
            ))}

            <div className='flex items-center gap-5 mt-4'>
                <div className='flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3'>
                    <LuPaperclip className='text-gray-400' />

                    <input
                        type='text'
                        value={option}
                        onChange={(e) => setOption(e.target.value)}
                        placeholder='Add attachment'
                        className='w-full text-[13px] text-black outline-none bg-white py-2'
                    />

                </div>

                <button className='card-btn text-nowrap' onClick={handleAddOption}>
                    <HiMiniPlus className='text-lg' /> Add Attachment
                </button>
            </div>
        </div>
  )
}

export default AddAttachmentsInput