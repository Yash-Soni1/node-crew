import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom'

//auth pages
import Login from './Pages/Auth/Login'
import SignUp from './Pages/Auth/SignUp'

//admin pages
import Dashboard from './Pages/Admin/Dashboard'
import CreateTask from './Pages/Admin/CreateTask'
import ManageUsers from './Pages/Admin/ManageUsers'
import ManageTasks from './Pages/Admin/ManageTasks'

//user pages
import UserDashboard from './Pages/User/UserDashboard'
import MyTasks from './Pages/User/MyTasks'
import ViewTaskDetails from './Pages/User/ViewTaskDetails'

//private route
import PrivateRoute from './Routes/PrivateRoute'
import UserProvider, { UserContext } from './Context/userContext'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
  <UserProvider>
    <div>
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />


        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/tasks' element={<ManageTasks />} />
          <Route path='/admin/create-task' element={<CreateTask />} />
          <Route path='/admin/users' element={<ManageUsers />} />
        </Route>

        {/* User Routes */}
        <Route element={<PrivateRoute allowedRoles={['user']} />}>
          <Route path='/user/dashboard' element={<UserDashboard />} />
          <Route path='/user/tasks' element={<MyTasks />} />
          <Route path='/user/task-details/:id' element={<ViewTaskDetails />} />
        </Route>

        {/* Default Routes */}
        <Route path='/' element={<Root />} />

      </Routes>
    </Router>
    </div>

    <Toaster toastOptions={{
      className: '',
        style: {
         fontSize: '13px',
        }
    }} />
  </UserProvider>
  )
}

export default App

const Root = () => {
  const { user, loading } = useContext(UserContext)

  if(loading) {
    return <Outlet />
  }

  if(!user) {
    return <Navigate to='/login' />
  }

  return user.role === 'admin' ? <Navigate to='/admin/dashboard' /> : <Navigate to='/user/dashboard' />
}