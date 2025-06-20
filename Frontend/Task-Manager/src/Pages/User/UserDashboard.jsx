import React, { useContext, useEffect, useState } from 'react'
import { useUserAuth } from '../../Hooks/useUserAuth'
import { UserContext } from '../../Context/userContext'
import DashboardLayout from '../../Components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../Utils/axiosInstance'
import { API_PATHS } from '../../Utils/apiPaths'
import moment from 'moment'
import { addThousandsSeparator } from '../../Utils/helper'
import InfoCard from '../../Components/Cards/InfoCard'
import { LuArrowRight } from 'react-icons/lu'
import TaskListTable from '../../Components/TaskListTable'
import CustomPieChart from '../../Components/Charts/CustomPieChart'
import CustomBarChart from '../../Components/Charts/CustomBarChart'


const COLORS = ['red', 'orange', 'green'];

const UserDashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Prepare Chart Data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: 'Pending', count: taskDistribution?.Pending || 0 },
      { status: 'In Progress', count: taskDistribution?.InProgress || 0 },
      { status: 'Completed', count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: 'Low', count: taskPriorityLevels?.Low || 0 },
      { priority: 'Medium', count: taskPriorityLevels?.Medium || 0 },
      { priority: 'High', count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(PriorityLevelData);
  }

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);

      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const onSeeMore = () => {
    navigate('/admin/tasks');
  }

  useEffect(() => {
    getDashboardData();

    return () => { }
  }, [])

  return <DashboardLayout activeMenu='Dashboard'>
    <div className='card my-5'>
      <div className='grid grid-cols-4'>
        <div className='col-span-3'>
          <h2 className='text-xl md:text-2xl'>Good {!moment().isBefore(moment().set('hour', 12)) ? 'Afternoon' : 'Morning'}! {user?.name}</h2>
          <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
            {moment().format('dddd Do MMM YYYY')}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
        <InfoCard
          label='Total Tasks'
          value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.All || 0
          )}
          color='bg-primary'
        />
        <InfoCard
          label='Pending Tasks'
          value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.Pending || 0
          )}
          color='bg-red-500'
        />
        <InfoCard
          label='In Progress Tasks'
          value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.InProgress || 0
          )}
          color='bg-yellow-500'
        />
        <InfoCard
          label='Completed Tasks'
          value={addThousandsSeparator(
            dashboardData?.charts?.taskDistribution?.Completed || 0
          )}
          color='bg-green-500'
        />
      </div>
    </div>

    <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>

        <div>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='font-medium'>Task Distribution</h5>
            </div>
            <CustomPieChart 
              data={pieChartData} 
              colors={COLORS}
            />
          </div>
        </div>

        <div>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='font-medium'>Task Priority Levels</h5>
            </div>
            <CustomBarChart 
              data={barChartData}
            />
          </div>
        </div>



        <div className='md:col-span-2'>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='text-lg'>Recent Tasks</h5>

              <button className='card-btn' onClick={onSeeMore}>See All <LuArrowRight className='text-base' /></button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
  </DashboardLayout>
}

export default UserDashboard