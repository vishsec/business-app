import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'


export default function Profile() {
  const {currentUser, loading, error} = useSelector((state) => state.user); 
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [ fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings ] = useState([]);
  const dispatch = useDispatch();
  // console.log(formData);
  // console.log(fileUploadError);
  // console.log(filePerc);

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }

  },[file] );

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name; //we add date to handle multiple file uploads and ensure different names
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file); //percent of upload and error

    uploadTask.on( 'state_changed',
     (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log('upload is' + progress + '% done');
      setFilePerc(Math.round(progress));
    },
    (error) => {
      setFileUploadError(true);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
        setFormData({ ...formData, avatar:downloadURL })
      );
    }
  );
  };

  // console.log(file);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value}); // the changes are tracked here.
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //wont submit by refreshing the page
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if(data.success === false)
          {
            dispatch(updateUserFailure(data.message));
            return;
          }
          dispatch(updateUserSuccess(data));
          setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method : 'DELETE',
      });
      const data = await res.json();
      if(data.success === false)
        {
          dispatch(deleteUserFailure(data));
          return;
        }
        dispatch(deleteUserSuccess(data));

      
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false)
        {
          dispatch(signOutUserFailure(data.message));
          return;
        }
        dispatch(signOutUserSuccess(data.message));
      
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }

  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
      
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto' >
    <h1 className='font-bold font-mono text-3xl text-center my-7 text-purple-300' >Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-5 ' >
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref ={fileRef} hidden accept='image/*' />

        <img onClick={() => 
        fileRef.current.click()} 
        src={formData.avatar || currentUser.avatar} alt="Profile" 
        className='rounded-full h-24 w-24 object-cover self-center mt-2 cursor-pointer'
        />

        <p className='text-sm self-center'>
          { fileUploadError ? (
          <span className='text-red-400 font-bold flex justify-center'>Upload Error : image must be 2mb/</span> 
        ) :
          filePerc>0 && filePerc<100 ? (
          <span className='text-purple-400 font-bold flex justify-center'> {`uploading ${filePerc} %`} </span> 
        ) :
          filePerc === 100 ? (
            <span className='text-purple-300 rounded-full font-semibold'>Image successfully uploaded! </span>
        ) : (
          ''
        )}
        </p>

        <input type="text" placeholder="username" id="username" defaultValue={currentUser.username}
        className='rounded-full p-3 border focus:outline-none'
        onChange={handleChange}
        />
        <input type="email" placeholder="email" id="email" defaultValue={currentUser.email}
        className='rounded-full p-3 border focus:outline-none'
        onChange={handleChange}
        />
        <input type="password" placeholder="password" id="password"
        className='rounded-full p-3 border focus:outline-none'
        onChange={handleChange}
        />

        <button disabled={loading} className='bg-purple-700 text-white rounded-full p-4 font-bold hover:opacity-70 diabled:opacity-90'>
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link  className='bg-fuchsia-900 text-white font-sans font-bold text-center rounded-full p-3 hover:bg-opacity-55' to={'/create-listing'}>
          Create listings
         </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-400 cursor-pointer font-semibold'>Delete account</span>
        <span onClick={handleSignOut} className='text-blue-200 cursor-pointer font-semibold '>Sign out</span>
      </div>

      <p className='text-red-600 mt-5 font-bold'>{error ? error : ' '}</p>
      <p className=' text-[#efeff5] mt-5 font-bold px-12 text-center py-5' > {updateSuccess ?  'User updated successfully !!' : ' '}</p>

      <button onClick={handleShowListings} className='text-violet-500 font-bold w-full text-2xl'> Show Listings </button>
      <p className='text-red-800 font-bold'>{showListingsError ? 'Show Listing error' : ''}</p>

      {userListings && userListings.length > 0  && 
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold text-fuchsia-500'>Your Listings</h1>
      {userListings.map((listing) => (
        <div key={listing._id} className='flex p-3 justify-between border rounded-lg border-slate-600 items-center gap-4'> 


            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt='image cover' className='object-contain h-16 w-16 rounded-2xl'/>
            </Link>

            <Link className='text-white flex-1 font-semibold hover:underline truncate' to={`/listing/${listing._id}`}> 
            <p>{listing.name}</p>
            </Link>

            <div className='flex flex-col'>
              <Link to={`/update-listing/${listing._id}`}>
              <button  className='text-blue-400 hover:underline'>edit</button>
              </Link>
              <button onClick={() => handleListingDelete(listing._id)} className='text-red-400 hover:underline '>Delete</button>
            </div>

        </div>
        
      ))}
      </div>}
    </div>
  );
}
