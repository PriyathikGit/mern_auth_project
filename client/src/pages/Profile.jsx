import React, { useRef, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { updateUserFailure, updateUserStart, updateUserSuccess } from "../features/UserSlice"

const Profile = () => {
  const { currentUser, loading, error } = useSelector(state => state.user)
  const [formData, setFormData] = useState({})
  const [image, setImage] = useState(null)
  const [successs, SetSuccess] = useState(false)


  const userId = currentUser.rest._id;
  const dispatch = useDispatch()
  const fileRef = useRef(null)
  const handleUploadImage = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
    }
  }
  const handleForm = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedFormData = new FormData()

    // Append text fields
    for (const key in formData) {
      updatedFormData.append(key, formData[key])
    }
    // Append the image if available
    if (image) {
      updatedFormData.append('profilePicture', image)
    }
    try {
      dispatch(updateUserStart())
      const response = await axios.patch(`/api/auth/${userId}`, updatedFormData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      dispatch(updateUserSuccess(response.data))
      SetSuccess(true)
      setTimeout(() => SetSuccess(false), 3000)
    } catch (error) {
      dispatch(updateUserFailure(error))
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleUpdate}>
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={handleUploadImage} />
        <img
          className='self-center w-24 h-24 object-cover rounded-full cursor-pointer my-2'
          src={currentUser.rest.profilePicture}
          alt="profilePicture"
          id='profilePicture'
          onClick={() => fileRef.current.click()}
        />
        <input type="text"
          defaultValue={currentUser.rest.username}
          id='username' placeholder='Username'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleForm}
        />
        <input type="email"
          id='email' defaultValue={currentUser.rest.email}
          placeholder='Email' className='bg-slate-100 rounded-lg p-3'
          onChange={handleForm}
        />
        <input type="password"
          id='password' placeholder='Password' className='bg-slate-100 rounded-lg p-3'
          onChange={handleForm}
        />
        <button
          className='bg-slate-700 p-3 rounded-lg text-white uppercase cursor-pointer hover:opacity-90 disabled:opacity-50'>
          {loading ? 'updating' : 'update'}</button>
      </form>
      <div className='flex justify-between mt-4'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      {error && <p className='text-red-700 mt-5'>{error}</p>}
      {successs && <p className='text-green-500 mt-5'>updated successfully</p>}
    </div >
  )
}

export default Profile