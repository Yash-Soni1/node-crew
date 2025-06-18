import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../Components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../Utils/axiosInstance'
import { API_PATHS } from '../../Utils/apiPaths'
import { LuFileSpreadsheet } from 'react-icons/lu'
import TaskStatusTabs from '../../Components/TaskStatusTabs'
import TaskCard from '../../Components/Cards/TaskCard'

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');

  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, 
        {
          params: {
            status: filterStatus === 'All' ? '' : filterStatus,
          }
        }
      );
      setAllTasks(response?.data?.tasks?.length > 0 ? response?.data?.tasks : []);

      const statusSummary = response?.data?.statusSummary || {};

      const statusArray = [
        { label: 'All', count: statusSummary.all || 0 },
        { label: 'Pending', count: statusSummary.pending || statusSummary.Pending || 0 },
        { label: 'In Progress', count: statusSummary.inProgress || statusSummary['In Progress'] || 0 },
        { label: 'Completed', count: statusSummary.completed || statusSummary.Completed || 0 },
      ];
      

      setTabs(statusArray);

    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleClick = (taskData) => {
    navigate(`/admin/create-task`, {
      state: {
        taskId: taskData._id,
      }
    });
  }

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tasks-details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Tasks report downloaded successfully");
    } catch (error) {
      console.error("Error downloading tasks report", error);
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);

    return () => {};
  }, [filterStatus]);

  return <DashboardLayout activeMenu='Manage Tasks'>
    <div className='my-5'>
      <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
        <div className='flex items-center gap-3 justify-between'>
          <h2 className='text-xl md:text-xl font-medium'>My Tasks</h2>
        </div>

        {tabs?.[0]?.count > 0 && (
            <div className='flex items-center gap-3'>
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={(value) => setFilterStatus(value)}
              />

          <button 
            className='flex md:flex download-btn'
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className='text-lg text-lime-500' />
            Download Tasks Report
          </button>
            </div>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
        {allTasks.map((item, index) => (
          <TaskCard
            key={item._id}
            title={item.title}
            description={item.description}
            priority={item.priority}
            status={item.status}
            progress={item.completedTodoCount / item.todoChecklist?.length}
            createdAt={item.createdAt}
            dueDate={item.dueDate}
            assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
            attachmentCount={item.attachments?.length || 0}
            completedTodoCount={item.completedTodoCount || 0}
            todoChecklist={item.todoChecklist || []}
            onClick={() => handleClick(item)}
          />
        ))}
      </div>
    </div>
  </DashboardLayout>
}

export default ManageTasks