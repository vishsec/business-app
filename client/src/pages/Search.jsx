import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    // const [showmore, setShowmore] = useState(false);
    const [sidebardata,setSidebardata] = useState({
        searchterm : ' ',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order: 'desc',
    });

    console.log(listings);
    // console.log(sidebardata);
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchtermFromUrl = urlParams.get('searchterm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');
    if ( // if anything changes
        searchtermFromUrl ||
        typeFromUrl ||
        parkingFromUrl ||
        furnishedFromUrl ||
        offerFromUrl ||
        sortFromUrl ||
        orderFromUrl
      ) {
        setSidebardata({
          searchterm: searchtermFromUrl || '',
          type: typeFromUrl || 'all',
          parking: parkingFromUrl === 'true' ? true : false,
          furnished: furnishedFromUrl === 'true' ? true : false,
          offer: offerFromUrl === 'true' ? true : false,
          sort: sortFromUrl || 'created_at',
          order: orderFromUrl || 'desc',
        });
    }

    const fetchListings = async () => {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        setListings(data);
        setLoading(false);
    };

    fetchListings();
 }, [location.search]);

    const handleChange =(e) => {
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale' ){
            setSidebardata({...sidebardata, type: e.target.id})
        }

        if(e.target.id === 'searchterm' ){
            setSidebardata({...sidebardata, searchterm: e.target.value})
        }

        if ( e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebardata({...sidebardata, [e.target.id]:
                e.target.checked || e.target.checked === 'true' ? true : false,
            });
          }

          if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
      
            const order = e.target.value.split('_')[1] || 'desc';
      
            setSidebardata({ ...sidebardata, sort, order });
          }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchterm', sidebardata.searchterm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

  return (
    <div className='flex flex-col md:flex-row'>

        <div className='p-7 border-b-2 md:border-b-0 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit}  className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='text-white whitespace-nowrap font-semibold'> Search Term:</label>
                    <input
                    type='text'
                    id='searchterm'
                    placeholder='Search..'
                    className='p-3 rounded-lg w-full border'
                    value={sidebardata.searchterm}
                    onChange={handleChange}
                     />
                </div>
                <div className='text-white flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input 
                        type="checkbox"
                        id="all"
                        className='w-5'
                        onChange={handleChange}
                        checked= {sidebardata.type === 'all'}
                         />
                         <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        type="checkbox"
                        id='rent'
                        className='w-5'
                        onChange={handleChange}
                        checked= {sidebardata.type === 'rent'}
                         />
                         <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        type="checkbox"
                        id="sale"
                        className='w-5'
                        onChange={handleChange}
                        checked= {sidebardata.type === 'sale'}
                         />
                         <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        type="checkbox"
                        id="offer"
                        className='w-5'
                        onChange={handleChange}
                        checked= {sidebardata.offer}
                         />
                         <span>Offer</span>
                    </div>
                </div>

                <div className='text-white flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input 
                        type="checkbox"
                        id="parking"
                        className='w-5'
                        onChange={handleChange}
                        checked= {sidebardata.parking}
                         />
                         <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input 
                        type="checkbox"
                        id="furnished"
                        className='w-5'
                        onChange={handleChange}
                        checked= {sidebardata.furnished}
                         />
                         <span>Furnished</span>
                    </div>
                </div>

                <div className='flex items-center gap-2 '>
                    <label className='text-white font-semibold'>Sort:</label>
                    <select 
                    onChange={handleChange}
                    defaultValue={'created_at_desc'}
                    className='border rounded-lg p-2 text-white bg-neutral-800' 
                    id="sort_order">
                        <option value='regularPrice_desc'>Price high-low</option>
                        <option value='regularPrice_asc' >Price low-high</option>
                        <option value='createdAt_desc'>latest</option>
                        <option value='createdAt_asc'>oldest</option>

                    </select>
                </div>

                <button className='bg-neutral-900 text-white p-3 rounded-lg font-bold hover:opacity-95 '
                >search</button>
            </form>
        </div>


        <div className='flex-1'>
            <h1 className='text-neutral-200 font-semibold mt-5 text-2xl p-3'>Listings Found:</h1>
            <div className='p-7 flex flex-wrap gap-4'>
                {!loading && listings.length === 0 && (
                    <p className='text-xl text-red-700'>listing Not Found!</p>
                )}
            </div>
        </div>



    </div>
  )
}
