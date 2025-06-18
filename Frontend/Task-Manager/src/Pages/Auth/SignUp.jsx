import React, { useState, useContext } from 'react'
import AuthLayout from '../../Components/layouts/AuthLayout'
import ProfilePicSelector from '../../Components/Inputs/ProfilePicSelector'

import { validateEmail } from '../../Utils/helper'
import Input from '../../Components/Inputs/Input'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../Utils/axiosInstance'
import { API_PATHS } from '../../Utils/apiPaths'
import { UserContext } from '../../Context/userContext'
import uploadImage from '../../Utils/uploadImage'

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminInvitToken, setAdminInvitToken] = useState('')

  const [error, setError] = useState(null)

  const { updateUser } = useContext(UserContext)

  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()

    let profileImageUrl = '';

    if (!fullName) {
      setError('Please enter your full name')
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError('Please enter your password')
      return;
    }

    setError("");

    //signup api call
    try {

      //upload profile image
      if(profilePic) {
       const imgUploadRes = await uploadImage(profilePic)
       profileImageUrl = imgUploadRes.imageUrl || '';
      }


      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,
         { 
          name: fullName,
          email, 
          password,
          profileImageUrl,
          adminInvitToken
        })

        const {token, role} = response.data;

        if(token) {
          localStorage.setItem('token', token)
          updateUser(response.data)

          if(role === 'admin') {
            navigate('/admin/dashboard')
          } else {
            navigate('/user/dashboard')
          }
        }


    } catch (error) {
      if(error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong. Please try again later")
      }
    }


  };
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create An Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Join us today by entering your details below.</p>
        <form onSubmit={handleSignUp}>
          <ProfilePicSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} label='Full Name' placeholder='John Doe' />
            <Input type='text' value={email} onChange={(e) => setEmail(e.target.value)} label='Email Address' placeholder='john@example.com' />
            <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} label='Password' placeholder='Minimum 8 characters' />
            <Input type='text' value={adminInvitToken} onChange={(e) => setAdminInvitToken(e.target.value)} label='Admin Invite Token' placeholder='6 Digit Code' />
          </div>

            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

            <button type='submit' className='btn-primary'>SIGN UP</button>
            <p className='text-[13px] text-slate-800 mt-3'>
              Already have an account?{" "}
              <Link className='text-primary font-medium underline' to='/login'>Login</Link>
            </p>
        </form>
      </div>

    </AuthLayout>
  )
}

export default SignUp