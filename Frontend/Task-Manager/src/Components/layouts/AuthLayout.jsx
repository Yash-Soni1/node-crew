import React from 'react'
import UI_IMG from '../../assets/images/auth-image.webp'

const AuthLayout = ({ children }) => {
    return <div className='flex'>
        <div className='w-screen h-screen md:w-[60vw] px-12 pt-8'>
            <h2 className='text-lg font-medium text-black'>NodeCrew</h2>
            {children}
        </div>

        <div className='hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[url(/public/bg-image.avif)] bg-cover bg-no-repeat bg-center overflow-hidden'>
            <img src={UI_IMG} className='w-72 lg:w-[90%]' />
        </div>
    </div>
}

export default AuthLayout