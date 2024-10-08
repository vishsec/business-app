import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import {
    FaShare,
    FaMapMarkerAlt,
    FaBed,
    FaBath,
    FaParking,
    FaChair
}from 'react-icons/fa';
import {useSelector} from 'react-redux';
import Contact from '../components/Contact';


export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const {currentUser} = useSelector((state) => state.user);
    const params = useParams();

    useEffect(() => {
        
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();

                console.log(data);
                if(data.success === false){
                    setError(true);
                    setLoading(false);
                    return;
                }
    
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
           

        };
        fetchListing();

    }, [params.listingId]); // this condition ensures useEffect is run once when we encounter id


  return (
  <main className='text-white'>
    {loading && <p className='text-center my-7 text-xl'>Loading ...</p>}
    {error && <p className='text-center my-7 text-xl'>  An error occured </p>}
    { listing && !loading && !error && 
    <div>
    <Swiper navigation>
        {listing.imageUrls.map((url) => (
            <SwiperSlide key={url}>
                <div className='h-[550px h-[55vh] '
                     style={{ background: `url(${url}) center no-repeat` , backgroundSize: 'cover'}}
                ></div>
            </SwiperSlide>
        ))}
    </Swiper>

    <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-900'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-900 p-2'>
                link copied.
            </p>
          )}


          <div className='flex flex-col max-w-5xl mx-auto p-3 my-7 gap-4'>
          
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'Rent' && ' / month'}
            </p>

            <p className='flex items-center mt-6 gap-2 text-green-600  text-base font-semibold'>
              <FaMapMarkerAlt className='text-green-600' />
              {listing.address}
            </p>

            <div className='flex gap-7'>
              <p className='bg-blue-900 w-full max-w-[200px] text-white font-semibold text-center p-1 rounded-md'>
                {listing.type === 'Rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-700 w-full max-w-[200px] text-white font-semibold text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>

            <p className='text-cyan-300'>
              <span className='font-semibold text-emerald-400'>Description - </span>
              {listing.description}
            </p>

            <ul className='text-green-400 font-semibold text-base flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && ( //!contact, click makes contact true , but here inly false gives button
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg hover:opacity-95 p-2 max-w-sm font-semibold'
              >
                Contact landlord through Email?
              </button>
            )}

            {contact && <Contact listing={listing}/> }

          </div>


    </div>
    }    
  </main>
  );
}
