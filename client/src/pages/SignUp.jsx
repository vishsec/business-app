import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto ' >
      <h1 className="font-semibold text-4xl text-center my-16 font-sans">Sign up</h1>
      <form className='gap-7 flex flex-col' >
        <input type="text" placeholder="username" className='border p-3 rounded-lg focus:outline-none' id='username' />
        <input type="text" placeholder="email" className='border p-3 rounded-lg focus:outline-none' id='email' />
        <input type="text" placeholder="password" className='border p-3 rounded-lg focus:outline-none' id='password' />
        <button className='bg-blue-900 hover:opacity-80 text-white font-semibold p-3 rounded-lg' >sign up</button>
      </form>
      <div className='flex gap-2 mt-2'>
        <p className='font-semibold' >Already a user?</p>
        <Link to={"/sign-in"}>
          <span className='text-[#0e202b] font-sans hover:text-white hover:underline' >sign in</span>
        </Link>
      </div>
     
    </div>
  )
}
