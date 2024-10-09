import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

export default function ListingItem({listing}) {
  return (
    <div className=' w-full sm:w-[320px]  bg-black shadow-md rounded-lg overflow-hidden hover:shadow-emerald-500 '>
        <Link to={`/listing/${listing._id}`}>
        <img className='w-full object-cover hover:scale-105 transition-scale duration-200' src={listing.imageUrls[0]} alt="cover" />
        <div className='p-3 flex flex-col gap-2'>
            <p className='font-semibold text-white truncate'>{listing.name}</p>
            <div className='text-white py-2 flex items-center gap-2'>
            <MdLocationOn className='h-4 w-4 text-green-500' />
            <p className='truncate text-emerald-300 text-sm'>{listing.address}</p>
            </div>
            <p className='text-emerald-200 text-sm line-clamp-2'>{listing.description}</p>
            <p className='text-white mt-2 font-semibold flex items-center'>
                $
                {listing.offer ? listing.discountPrice.toLocaleString('en-US') :listing.regularPrice.toLocaleString('en-US') }
                {listing.type === 'rent' && ' / month'}
            </p>
        </div>
        </Link>
    </div>
  )
}
