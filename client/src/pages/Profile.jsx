import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user); 
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [ fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
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

  console.log(file);
  return (
    <div className='p-3 max-w-lg mx-auto' >
    <h1 className='font-semibold text-3xl text-center my-7 text-purple-300' >Profile</h1>

      <form className='flex flex-col gap-5 ' >
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref ={fileRef} hidden accept='image/*' />

        <img onClick={() => 
        fileRef.current.click()} 
        src={formData.avatar || currentUser.avatar} alt="Profile" 
        className='rounded-full h-24 w-24 object-cover self-center mt-2 cursor-pointer'
        />

        <p>
          { fileUploadError ? (
          <span className='text-red-400 font-bold flex justify-center'>Upload Error :/</span> 
        ) :
          filePerc>0 && filePerc<100 ? (
          <span className='text-purple-400 font-bold flex justify-center'> {`uploading ${filePerc} %`} </span> 
        ) :
          filePerc === 100 ? (
            <span className='text-green-900 px-3 bg-purple-300 rounded-full font-bold flex justify-center'>Image successfully uploaded! </span>
        ) : (
          ''
        )}
        </p>

        <input type="text" placeholder="username" id="username"
        className='rounded-lg p-3 border focus:outline-none'
        />
        <input type="email" placeholder="email" id="email"
        className='rounded-lg p-3 border focus:outline-none'
        />
        <input type="text" placeholder="password" id="password"
        className='rounded-lg p-3 border focus:outline-none'
        />

        <button className='bg-slate-900 text-white rounded-lg p-3 font-bold hover:opacity-70 diabled:opacity-90'>update</button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-400 cursor-pointer font-semibold'>Delete account</span>
        <span className='text-indigo-200 cursor-pointer font-semibold '>Sign out</span>
      </div>
    </div>
  )
}
