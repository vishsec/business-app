import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-[#1f3c72] shadow-lg" >
        <div className="flex justify-between items-center max-w-9xl mx-auto p-2">
        <Link to="/">
        <h1 className=' font-bold text-sm md:text-xl flex flex-wrap'>
            <span className="text-gray-300 font-serif ">Business</span>
            <span className="text-gray-300 font-serif ">Name</span>
        </h1>
        </Link>

        <form className="bg-[#89d9f0] p-3 rounded-lg flex items-center">
            <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-80 " />
            <FaSearch className="text-slate-800"/>
        </form>
        <ul className="flex gap-7">
            <Link to="/about">
            <li className="text-sans text-white font-bold">About</li>
            </Link>
            <Link to ="/sign-in">
            <li className="text-sans text-white font-bold">Sign in</li>
            </Link>
        </ul>

        </div>
    </header>
  )
}
