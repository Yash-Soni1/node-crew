import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../Components/layouts/DashboardLayout'
import axiosInstance from '../../Utils/axiosInstance'
import { API_PATHS } from '../../Utils/apiPaths'
import { LuFileSpreadsheet } from 'react-icons/lu'
import UserCard from '../../Components/Cards/UserCard'

const ManageUsers = () => {

  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

      if(response?.data?.length > 0) {
        setAllUsers(response.data);
      }

    } catch (error) {
      console.error("Error getting users", error);
    }
  }

  const handleDownloadUsersReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users-details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Users report downloaded successfully");

    } catch (error) {
      console.error("Error downloading users report", error);
      toast.error("Error downloading users report");
    }
  }

  useEffect(() => {
    getAllUsers();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu='Team Members'>
      <div className='mt-5 mb-10'>
        <div className='flex md:flex-row justify-between md:items-center'>
          <h2 className='text-xl md:text-xl font-medium'>Team Members</h2>

          <button 
            className='flex md:flex download-btn'
            onClick={handleDownloadUsersReport}
          >
            <LuFileSpreadsheet className='text-lg text-lime-500' />
            Download Users Report
          </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-4'>
          {allUsers?.map((user) => (
            <UserCard key={user?._id} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ManageUsers