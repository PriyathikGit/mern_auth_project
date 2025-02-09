import React, { useState } from 'react'
import { Link,Navigate,useNavigate } from 'react-router-dom';
import axios from "axios"
export const Sign_In = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }) //{id:value}
  }
  console.log(formData);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post("/api/auth/signin", formData);
      const data = response.data;
      setLoading(false);
      setError(null)
      navigate("/")
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.response.data.message)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="text" placeholder='email' id='email' className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <input type="password" placeholder='password' id='password' className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-90'>
          {loading ? "...loading" : "Sign in"}
        </button>
      </form>
      <div className='flex gap-4 mt-5'>
        <p>Create an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-500'>Sign up</span>
        </Link>
      </div>
      <p className='text-red-400'>{error && error}</p>
    </div>
  )
}
