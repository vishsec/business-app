import React, { useState } from 'react'
import { getStorage, getDownloadURL, uploadBytesResumable, ref} from 'firebase/storage';
import { app } from '../firebase.js';

export default function CreateListing() {

    const [files , setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });

    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false); 
    // console.log(formData);

    const handleImageSubmit = (e) => {
        if(files.length>0 && files.length + formData.imageUrls.length <7)
            {
                setUploading(true);
                setImageUploadError(false);
                const promises = [];

                for(let i =0; i< files.length; i++)
                    {
                        promises.push(storeImage(files[i]));
                    }

                    Promise.all(promises).then((urls) => {
                        setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                        setImageUploadError(false);
                        setUploading(false);
                    }).catch((error) => {
                        setImageUploadError('ERROR:image upload failed');
                        setUploading(false);
                    });
            } else {
                setImageUploadError('ERROR:Try uploading alteast one or atmost six images!');
                setUploading(false);
            }
        };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`upload is ${progress} done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl);
                    });
                }
            )
        });
    };
    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls : formData.imageUrls.filter((_,i) => i !== index),
        });
    };



  return (
    <main className='mx-auto max-w-4xl p-3'>
        <h1 className='text-white font-semibold text-3xl text-center my-7'> Create a listing</h1>
        <form className='flex flex-col sm:flex-row gap-3'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' id='name' required className=' focus:outline-none p-3 rounded-xl bg-neutral-200'/>
                <textarea type='text' placeholder='Description' id='name' required className='border focus:outline-none p-7 rounded-xl bg-neutral-200'/>
                <input type='text' placeholder='Address' id='name' required className='border focus:outline-none p-5 rounded-xl bg-neutral-200'/>
            

            <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>
                    <input type='checkbox' id='sale' className='w-7'/>
                    <span className='text-white font-semibold'>Sell</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='Rent' className='w-7'/>
                    <span className='text-white font-semibold'>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='parking' className='w-7'/>
                    <span className='text-white font-semibold'>Parking spot</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='furnished' className='w-7'/>
                    <span className='text-white font-semibold'>Furnished</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='offer' className='w-7'/>
                    <span className='text-white font-semibold'>Offer</span>
                </div>
            </div>

            <div className='flex flex-row flex-wrap gap-6'>
                <div className='flex items-center gap-2'>
                    <input type='number' id='bedrooms' min={1} max={13} required className='p-3 border border-gray-300 rounded-xl w-20 focus:outline-none' />
                    <p className='text-white font-semibold'>Beds</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input type='number' id='bathrooms' min={1} max={13} required className='p-3 border rounded-xl w-20 focus:outline-none' />
                    <p className='text-white font-semibold'>Baths</p>
                </div>
                <div className='flex items-center gap-2'>
                    <input type='number' id='regularPrice' min={1} required className='p-3 border rounded-xl w-36 focus:outline-none' />
                    <div className='flex flex-col items-center'>
                    <p className='text-white font-semibold'>Regular Price</p>
                    <span className='text-xs text-white'>(per month)</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <input type='number' id='discountPrice' min={1} required className='p-3 border rounded-xl w-36 focus:outline-none' />
                    <div className='flex flex-col items-center'>
                    <p className='text-white font-semibold'>Discounted Price</p>
                    <span className='text-white text-xs'>(per month)</span>
                    </div>  
                </div>

            </div>
            </div>

            <div className='flex flex-col flex-1 text-white gap-4'>
                <p className='font-semibold'> Images :
                <span className='ml-2 font-normal'>The first image will be the cover (max 6)</span>
                </p>

                <div className='flex gap-7'>
                    <input onChange={(e) => setFiles(e.target.files) } type="file" id='images' accept='/images*' multiple className='p-3 rounded border border-stone-950 w-full' />
                    <button disabled={uploading} onClick={handleImageSubmit} type='button' className='bg-stone-800 border border-stone-950 text-zinc-300 rounded-lg p-3 hover:shadow-xl '>
                        {uploading ? 'Uploading...' : 'Upload' }
                    </button>
                </div>

                <p className='text-red-500 font-semibold text-sm'> {imageUploadError && imageUploadError} </p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((urls, index) => (
                        <div key={urls} className='flex justify-between p-3 border border-black rounded-lg items-center'   >
                            <img src={urls} alt='listing' className='w-20 h-20 object-contain rounded-lg' />
                            <button type='button' onClick={ () => handleRemoveImage(index)} className='p-3 text-red-500 hover:opacity-80'>Delete</button>
                        </div>
                        
                    ))
                }   

                <button  className='bg-neutral-500 p-3 rounded-lg text-black font-semibold text-center hover:opacity-70'>
                Create listing
                </button>
            </div>

            

      
        </form>
        </main>
  )
}
