import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { MdInfo } from 'react-icons/md';

export default function Header() {
  const {currentUser} = useSelector(state => state.user);
  const [searchterm, setSearchterm] = useState(' ');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchterm', searchterm);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchterm');
    if (searchTermFromUrl) {
      setSearchterm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-[#1a1a1a] shadow" >
        <div className="flex justify-between items-center max-w-8xl mx-auto">
        <Link to="/">
        <h1 className=' font-bold text-sm md:text-xl flex flex-wrap p-2'>
            <span className="text-emerald-600 font-serif ">Vishsec</span>
            <span className="text-emerald-400 font-serif ">Homes</span>
        </h1>
        </Link>

        <form onSubmit={handleSubmit} className="bg-[#2f2e2e] p-3 rounded-2xl flex items-center">
            <input 
            type="text" 
            placeholder="Search..." 
            className='bg-transparent text-white focus:outline-none w-24 sm:w-80'
            value={searchterm}
            onChange ={ (e) => setSearchterm(e.target.value) }
            />
            <button>
            <FaSearch className="text-slate-900"/>
            </button> 
        </form>


        <ul className="flex ">
            <Link to="/about">
            {/* <li className="text-sans text-emerald-600 font-bold text-sm p-3">More on us</li> */}
            <li className='p-3 flex items-center justify-center py-4 md:py-2'>
            <MdInfo className='text-emerald-700 text-2xl md:text-4xl '/>
            </li>
            
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
