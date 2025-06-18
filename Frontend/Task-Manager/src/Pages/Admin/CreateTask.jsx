import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../Components/layouts/DashboardLayout'
import { PRIORITY_LEVELS } from '../../Utils/data';
import axiosInstance from '../../Utils/axiosInstance';
import { API_PATHS } from '../../Utils/apiPaths';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import SelectDropdown from '../../Components/Inputs/SelectDropdown';
import SelectUsers from '../../Components/Inputs/SelectUsers';
import TodoListInput from '../../Components/Inputs/TodoListInput';
import AddAttachmentsInput from '../../Components/Inputs/AddAttachmentsInput';
import DeleteAlert from '../../Components/DeleteAlert';
import Modal from '../../Components/Modal';

const CreateTask = () => {


const location = useLocation();
const {taskId} = location.state || {};
const navigate = useNavigate();

const [taskData, setTaskData] = useState({
  title: '',
  description: '',
  priority: 'Low',
  dueDate: null,
  assignedTo: [],
  todoChecklist: [],
  attachments: [],
});

const [currentTask, setCurrentTask] = useState(null);

const [errors, setErrors] = useState("");
const [loading, setLoading] = useState(false);

const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

const handleValueChange = (key, value) => {
  setTaskData((prevData) => ({...prevData, [key]: value}));
}

const clearData = () => {
  setTaskData({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  })
}

const createTask = async () => {
  setLoading(true);

  try {
    const todoList = taskData.todoChecklist?.map((item) => ({
      text: item,
      completed: false,
    }))
    const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
      ...taskData,
      dueDate: new Date(taskData.dueDate).toISOString(),
      todoChecklist: todoList,
    })
    toast.success('Task created successfully');
    clearData();
  }
  catch(error) {
    console.error("Error creating task", error);
    setLoading(false);
  }
  finally {
    setLoading(false);
  }
};


const updateTask = async () => {
  setLoading(true);

  try {
    const todoList = taskData.todoChecklist?.map((item) => {
      const prevTodoChecklist = currentTask?.todoChecklist || [];
      const matchedTask = prevTodoChecklist.find((task) => task.text === item);
     
      return {
        text: item,
        completed: matchedTask ? matchedTask.completed : false,
      }
    })

    const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
      ...taskData,
      dueDate: new Date(taskData.dueDate).toISOString(),
      todoChecklist: todoList,
    })
    toast.success('Task updated successfully');
  } catch (error) {
    console.error("Error updating task", error);
    setLoading(false);
  }
  finally {
    setLoading(false);
  }
};

const handleSubmit = async (e) => {
  setErrors(null);

  if(!taskData.title.trim()) {
    setErrors('Task title is required');
    return;
  }

  if(!taskData.description.trim()) {
    setErrors('Task description is required');
    return;
  }

  if(!taskData.dueDate) {
    setErrors('Due date is required');
    return;
  }

  if(taskData.assignedTo?.length === 0) {  
    setErrors('At least one user is required');
    return;
  }

  if(taskData.todoChecklist?.length === 0) {
    setErrors('At least one todo item is required');    
    return;
  }

  if(taskId) {
    await updateTask();
    navigate('/admin/tasks');
  } else {
    await createTask();
    navigate('/admin/tasks');
  }
}



const getTaskDetailsById = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));

    if (response.data) {
      const taskInfo = response.data;
      setCurrentTask(taskInfo);

      setTaskData({
        title: taskInfo.title,
        description: taskInfo.description,
        priority: taskInfo.priority,
        dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format('YYYY-MM-DD') : null,
        assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
        todoChecklist: taskInfo?.todoChecklist?.map((item) => item?.text) || [],
        attachments: taskInfo?.attachments || [],
      });
    }
  } catch (error) {
    console.error("Error getting task details", error);
  }
};


const deleteTask = async () => {
  try {
    await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

    setOpenDeleteAlert(false);
    toast.success('Task deleted successfully');
    navigate('/admin/tasks');
  } catch (error) {
    console.error("Error deleting task", error.response?.data?.message || error.message);
  }
};

useEffect(() => {
  if(taskId) {
    getTaskDetailsById();
  }
  return () => {}
}, [taskId]);


  return (
    <DashboardLayout activeMenu='Create Task'>
      <div className='mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
          <div className='form-card col-span-3'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-xl font-medium'>{taskId ? 'Update Task' : 'Create Task'}</h2>


              {taskId && (
                <button 
                  className='flex items-center gap-1.5 text-rose-500 text-[13px] font-medium bg-rose-50 px-2 py-1 rounded border border-rose-100 hover:border-rose-300 cursor-pointer'
                  onClick={() => setOpenDeleteAlert(true)}
                  >
                    <LuTrash2 className='text-base' />
                    Delete Task
                </button>
              )}
            </div>

            <div className='mt-4'>
              <label className='text-xs font-medium text-slate-600'>
                Task Title
              </label>
              <input 
                placeholder='Create App UI'
                className='form-input'
                value={taskData.title}
                onChange={({target}) => handleValueChange('title', target.value)}
              />
            </div>

            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                Task Description
              </label>
              <textarea 
                placeholder='Create App UI'
                className='form-input'
                rows={4}
                value={taskData.description}
                onChange={({target}) => handleValueChange('description', target.value)}
              />
            </div>
            
            <div className='grid grid-cols-12 gap-4 mt-2'>
              <div className='col-span-6 md:col-span-4'>
                <label className='text-xs font-medium text-slate-600'>
                  Task Priority
                </label>

                <SelectDropdown
                  options={PRIORITY_LEVELS}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange('priority', value)}
                  placeholder='Select Priority'
                />
              </div>

              <div className='col-span-6 md:col-span-4'>
              <label className='text-xs font-medium text-slate-600'>
                Due Date
              </label>

              <input 
                placeholder='Create App UI'
                className='form-input'
                value={taskData.dueDate}
                onChange={({target}) => handleValueChange('dueDate', target.value)}
                type='date'
              />
              </div>

              <div className='col-span-12 md:col-span-3'>
                <label className='text-xs font-medium text-slate-600'>
                  Assigned To
                </label>

                <SelectUsers 
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => handleValueChange('assignedTo', value)}
                />
              </div>
            </div>

            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                Todo Checklist
              </label>
              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(value) => handleValueChange('todoChecklist', value)}
              />
            </div>

            <div className='mt-3'>
              <label className='text-xs font-medium text-slate-600'>
                Attachments
              </label>

              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(value) => handleValueChange('attachments', value)}
              /> 
            </div>

            {errors && (
                <p className='text-red-500 text-xs font-medium mt-5'>{errors}</p>
            )}

            <div className='mt-7 flex justify-end'>
              <button
                className='add-btn'
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div> 
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title='Delete Task'
      >
        <DeleteAlert
          content='Are you sure you want to delete this task?'
          onDelete={() => deleteTask()}
        />
      </Modal>


    </DashboardLayout>
  )
}

export default CreateTask