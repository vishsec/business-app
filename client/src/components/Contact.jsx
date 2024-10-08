import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';


export default function Contact({listing}) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState(' ');

    const onChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        const fetchLandlord = async () => {
          try {
            const res = await fetch(`/api/user/${listing.userRef}`);
            const data = await res.json();
            console.log(data);
            setLandlord(data);
          } catch (error) {
            console.log(error);
          }
        };
        fetchLandlord();
      }, [listing.userRef]);
  return (
    <>
    {landlord && 

    <div className='text-cyan-300  font-semibold flex flex-col gap-2'>
        <p> <span className='font-bold'>Contact Email- </span> <span>{landlord.username}</span> </p>
        <textarea 
        name="message" 
        id="mess" 
        row="2" 
        value={message} 
        onChange={onChange}
        placeholder='Enter your message here.'
        className='w-full, p-3 rounded-lg bg-zinc-600 text-white'
        ></textarea>

        <Link to={`mailto:${landlord.email}?Subject=Regarding your ${listing.name}&body=${message}`}
        className='bg-blue-500 p-2 text-white rounded-lg max-w-40 text-center'
        >  
        Send Message
        </Link>
    </div>
    }
    </>
  )
}
