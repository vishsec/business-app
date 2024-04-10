import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  const {currentUser} = useSelector(state => state.user); 
  return (
    <div className='p-3 max-w-lg mx-auto' >
    <h1 className='font-semibold text-3xl text-center my-7 text-purple-300' >Profile</h1>

      <form className='flex flex-col gap-5 ' >

        <img src={currentUser.avatar} alt="Profile" 
        className='rounded-full h-24 w-24 object-cover self-center mt-2 cursor-pointer'
        />

        <input type="text" placeholder="username" id="username"
        className='rounded-lg p-3 border focus:outline-none'
        />
        <input type="email" placeholder="email" id="email"
        className='rounded-lg p-3 border focus:outline-none'
        />
        <input type="text" placeholder="password" id="password"
        className='rounded-lg p-3 border focus:outline-none'
        />

        <button className='bg-slate-900 text-white rounded-lg p-3 font-bold hover:opacity-70 diabled:opacity-90'>update</button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-400 cursor-pointer font-semibold'>Delete account</span>
        <span className='text-indigo-200 cursor-pointer font-semibold '>Sign out</span>
      </div>
    </div>
  )
}
