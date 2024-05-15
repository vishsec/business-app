import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import {useSelector} from 'react-redux'

export default function Header() {
  const {currentUser} = useSelector(state => state.user);
  return (
    <header className="bg-[#1a1a1a] shadow" >
        <div className="flex justify-between items-center max-w-8xl mx-auto">
        <Link to="/">
        <h1 className=' font-bold text-sm md:text-xl flex flex-wrap p-2'>
            <span className="text-gray-300 font-serif ">Business</span>
            <span className="text-gray-300 font-serif ">Name</span>
        </h1>
        </Link>

        <form className="bg-[#2f2e2e] p-3 rounded-2xl flex items-center">
            <input type="text" placeholder="Search..." className="bg-transparent text-white focus:outline-none w-24 sm:w-80 " />
            <FaSearch className="text-slate-900"/>
        </form>
        <ul className="flex ">
            <Link to="/about">
            <li className="text-sans text-white font-bold p-3">About us</li>
            </Link>
            
            <Link to ="/Profile" className='p-3'>
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
