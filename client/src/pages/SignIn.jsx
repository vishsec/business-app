import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import { useSelector } from 'react-redux'
import OAuth from '../components/OAuth'


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error } = useSelector((state) => state.user); //selector hook is used 
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {             //handles changes in the input and makes sure the texts wont disappear and update themselves
    setFormData({
      ...formData,
      [e.target.id] : e.target.value,
    });
  };

  const handleSubmit = async (e) => {             //handles the submissions of those inputs
    e.preventDefault();

    try{
      dispatch(signInStart()); //(before redux) setLoading(true);

    const res = await fetch('/api/auth/signin', { //formdata
      method: 'POST',
      headers: { 
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log(data);

    if(data.success === false) {
      dispatch(signInFailure(data.message));

      //(before redux) setError(data.message);
      // setLoading(false);
      return;
    }
    dispatch(signInSuccess(data));
    // setLoading(false);
    // setError(null);
    navigate('/');

    } catch(error)
    {
      dispatch(signInFailure(error.message));
      // setLoading(false);
      // setError(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto ' >
      
      <h1 className="font-semibold text-4xl text-center my-16 font-sans">Sign in</h1>
      <form onSubmit={handleSubmit} className='gap-7 flex flex-col' >

        

        <input type="text" 
        placeholder="email" 
        className='border p-3 rounded-lg focus:outline-none' 
        id='email' 
        onChange={handleChange}/>

        <input type="text" placeholder="password" 
        className='border p-3 rounded-lg focus:outline-none' 
        id='password' 
        onChange={handleChange}/>

        <button disabled = {loading} className='bg-[#162b4f] hover:opacity-80 text-white font-semibold p-3 rounded-lg' >
          {loading ? 
          'loading...'
          : 
          'sign in' 
          }
        </button>
        <OAuth />

      </form>


      <div className='flex gap-2 mt-2'>
        <p className='font-semibold' >want to be a user?</p>
        <Link to={"/sign-up"}>
          <span className='text-[#0e202b] font-sans hover:text-white hover:underline' >sign up</span>
        </Link>
      </div>
      {error && <div className="bg-red-200 border-l-4 my-4 border-red-700 text-red-900 p-4 font-semibold" role="alertdialog" > Error: {error}</div>}
    </div>
  )
}
