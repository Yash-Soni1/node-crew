import React from 'react'
import { Link } from 'react-router-dom'

const UserCard = ({ userInfo }) => {
  return (
    <div className='user-card p-2'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
                <img src={userInfo?.profileImageUrl} alt={'Avatar'} className='w-12 h-12 rounded-full border border-white' />
                <div>
                    <p className='text-sm font-medium'>{userInfo?.name}</p>
                    <p className='text-xs text-gray-500'>{userInfo?.email}</p>
                </div>
            </div>
        </div>
        <div className='flex items-end gap-3 mt-5'>
            <StatCard
                count={userInfo?.pendingTasks || 0}
                status='Pending'
            />
            <StatCard
                count={userInfo?.completedTasks || 0}   
                status='Completed'
            />
            <StatCard
                count={userInfo?.inProgressTasks || 0}   
                status='In Progress'
            />
        </div>
    </div>
  )
}

export default UserCard


const StatCard = ({ count, status }) => {
    return (
        <div className='flex items-center gap-2'>
            <p className='text-xs text-primary'><Link to={`/admin/tasks`}>{status}</Link></p>
        </div>
    )
}