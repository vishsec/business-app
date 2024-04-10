
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import OAuth from '../components/OAuth';


export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {             //handles changes in the input and makes sure the texts wont disappear and update themselves
    setFormData({
      ...formData,
      [e.target.id] : e.target.value,
    });
  };

  const handleSubmit = async (e) => {             //handles the submissions of those inputs
    e.preventDefault();

    try{
      setLoading(true);

    const res = await fetch('/api/auth/signup', { //formdata
      method: 'POST',
      headers: { 
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data);

    if(data.success === false) {
      setError(data.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setError(null);
    navigate('/sign-in');

    } catch(error)
    {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto ' >
      
      <h1 className=" font-semibold text-4xl text-center my-16 font-sans text-purple-200">Sign up</h1>
      
      <form onSubmit={handleSubmit} className='gap-7 flex flex-col' >

        <input type="text" 
        placeholder="username" 
        className='border p-3 rounded-lg focus:outline-none' 
        id='username' 
        onChange={handleChange}/>

        <input type="text" 
        placeholder="email" 
        className='border p-3 rounded-lg focus:outline-none' 
        id='email' 
        onChange={handleChange}/>

        <input type="text" placeholder="password" 
        className='border p-3 rounded-lg focus:outline-none' 
        id='password' 
        onChange={handleChange}/>

        <button disabled = {loading} className='bg-slate-900 hover:opacity-80 text-white font-semibold p-3 rounded-lg' >
          {loading ? 
          'loading...'
          : 
          'sign up' 
          }
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-2'>
        <p className='font-semibold' >Already a user?</p>
        <Link to={"/sign-in"}>
          <span className='text-[#0e202b] font-sans hover:text-white hover:underline' >sign in</span>
        </Link>
      </div>
      {error && <div className="bg-red-200 border-l-4 my-4 border-red-700 text-red-900 p-4 font-semibold" role="alertdialog" > Error: {error}</div>}
      </div>
    
  )
}
