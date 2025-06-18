import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPaths';
import DashboardLayout from '../../Components/layouts/DashboardLayout';
import AvatarGroup from '../../Components/AvatarGroup';
import moment from 'moment';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case 'In progress':
        return 'bg-blue-50 text-blue-500 border border-blue-500/10 shadow-sm shadow-blue-500/10';
      case 'Completed':
        return 'bg-lime-50 text-lime-500 border border-lime-500/10 shadow-sm shadow-lime-500/10';
      default:
        return 'bg-red-50 text-red-500 border border-red-500/10 shadow-sm shadow-red-500/10';

    }
  }

  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));

      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task details", error);
    }
  };

  const updatedTodoChecklist = async (index) => {
    const todoChecklist = task.todoChecklist.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
  
    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        { todoChecklist }
      );
  
      if (response.status === 200 && response.data?.task) {
        setTask(response.data.task);
      } else {
        // fallback
        setTask(prev => ({
          ...prev,
          todoChecklist: todoChecklist,
        }));
      }
    } catch (error) {
      console.error("Failed to update checklist", error);
      setTask(prev => ({
        ...prev,
        todoChecklist: todoChecklist,
      }));
    }
  };
  

  const handleLinkClick = (link) => {
    if(!/^(http|https):\/\//i.test(link)) {
      link = 'https://' + link;
    }

    window.open(link, '_blank');
  }

  useEffect(() => {
    if (id) {
      getTaskDetailsById();
    }

    return () => { };
  }, [id]);

  return (
    <DashboardLayout activeMenu='My Tasks'>
      <div className='mt-5'>
        {task && (
          <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
            <div className='form-card col-span-3'>
              <div className='flex items-center justify-between'>
                <h2 className='text-base md:text-xl font-medium'>{task?.title}</h2>

                <div className={`text-[13px] font-medium ${getStatusTagColor(task?.status)} px-4 py-0.5 rounded`}>
                  {task?.status}
                </div>
              </div>
              <div className='mt-4'>
                <InfoBox label='Description' value={task?.description || 'No description provided'} />
              </div>
              <div className='grid grid-cols-12 gap-4 mt-4'>
                <div className='col-span-6 md:col-span-4'>
                  <InfoBox label='Priority' value={task?.priority} />
                </div>
                <div className='col-span-6 md:col-span-4'>
                  <InfoBox label='Due Date' value={task?.dueDate ? moment(task?.dueDate).format('DD MMM YYYY') : 'N/A'} />
                </div>
                <div className='col-span-6 md:col-span-4'>
                  <label className='text-xs font-medium text-slate-500'>
                    Assigned To
                  </label>
                  <AvatarGroup avatars={task?.assignedTo.map((item) => item?.profileImageUrl) || []} maxVisible={5} />
                </div>
              </div>
              <div className='mt-2'>
                <label className='text-xs font-medium text-slate-500'>
                  Todo Checklist
                </label>  
                  {task?.todoChecklist?.map((item, index) => (
                    <TodoCheckList key={`todo_${index}`} text={item?.text} isChecked={item?.completed} onChange={() => updatedTodoChecklist(index)} />
                ))}
              </div>
              {task?.attachments?.length > 0 && (
                <div className='mt-2'>
                  <label className='text-xs font-medium text-slate-500'>
                    Attachments
                  </label>
                    {task?.attachments.map((link, index) => (
                      <Attachment key={`link_${index}`} link={link} index={index} onClick={() => handleLinkClick(link)} />
                    ))}
                  </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ViewTaskDetails

const InfoBox = ({ label, value }) => {
  return <>
    <label className='text-xs font-medium text-slate-500'>{label}</label>

    <p className='text-[12px] md:text-[13px] font-medium text-slate-500'>
      {value}
    </p>
  </>
}

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return <div className='flex items-center gap-2 my-2'>
    <input type="checkbox" className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded' checked={isChecked} onChange={onChange} />

    <p className='text-[12px] md:text-[13px] font-medium text-slate-500'>{text}</p>
  </div>
}

const Attachment = ({ link, index, onClick }) => {
  return <div
    className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md cursor-pointer mb-3 mt-2'
    onClick={onClick}
  >
    <div className='flex-1 flex items-center gap-3'>
      <span className='text-sm font-medium text-gray-400'>
        {index < 9 ? `0${index + 1}` : index + 1}
      </span>
      <p className='text-sm text-black'>{link}</p>
    </div>
    <LuSquareArrowOutUpRight className='w-4 h-4 text-gray-400' />
  </div>
}