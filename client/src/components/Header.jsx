import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'

export default function Header() {
  const {currentUser} = useSelector(state => state.user);
  return (
    <header className="bg-[#444461] shadow" >
        <div className="flex justify-between items-center max-w-9xl mx-auto p-2">
        <Link to="/">
        <h1 className=' font-bold text-sm md:text-xl flex flex-wrap'>
            <span className="text-gray-300 font-serif ">Business</span>
            <span className="text-gray-300 font-serif ">Name</span>
        </h1>
        </Link>

        <form className="bg-neutral-300 p-3 rounded-lg flex items-center">
            <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-80 " />
            <FaSearch className="text-slate-800"/>
        </form>
        <ul className="flex gap-7">
            <Link to="/about">
            <li className="text-sans text-white font-bold">About</li>
            </Link>
            <Link to ="/Profile">
              { currentUser  ? 
              (
                <img className='rounded-full h-8 w-8 object-cover ' src={currentUser.avatar} alt="Profile"/>
              )
              :
              <li className="hover:underline font-bold text-white">Sign in</li>  
            }
            </Link>
        </ul>

        </div>
    </header>
  )
}
