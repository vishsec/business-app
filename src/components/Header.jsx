import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-green-500" >

        <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        <Link to="/">
        <h1 className='font-bold text-sm md:text-xl flex flex-wrap'>
            <span className="text-gray-900 font-serif ">Business</span>
            <span className="text-gray-700 font-serif ">Name</span>
        </h1>
        </Link>

        <form className="bg-slate-200 p-3 rounded-lg flex items-center">
            <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64" />
            <FaSearch className="text-slate-800"/>
        </form>
        <ul className="flex gap-4">
            <Link to="/about">
            <li className="text-sans text-black font-bold">About</li>
            </Link>
            <Link to ="/sign-in">
            <li className="text-sans text-black font-bold">Sign in</li>
            </Link>
        </ul>

        </div>
    </header>
  )
}
