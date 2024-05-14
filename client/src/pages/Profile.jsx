import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';


export default function Profile() {
  const {currentUser, loading, error} = useSelector((state) => state.user); 
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [ fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false); 
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

        <button disabled={loading} className='bg-slate-900 text-white rounded-full p-4 font-bold hover:opacity-70 diabled:opacity-90'>
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-400 cursor-pointer font-semibold'>Delete account</span>
        <span className='text-indigo-200 cursor-pointer font-semibold '>Sign out</span>
      </div>

      <p className='text-red-600 mt-5 font-bold'>{error ? error : ' '}</p>
      <p className=' text-[#efeff5] mt-5 font-bold px-12 text-center py-5' > {updateSuccess ?  'User updated successfully !!' : ' '}</p>
    </div>
  );
}
