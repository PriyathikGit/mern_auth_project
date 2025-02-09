import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
export const Signup = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }) //{id:value}
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post("/api/auth/signup", formData);
      const data = response.data;
      setLoading(false);
      setError(null)
      navigate('/sign-in')
    } catch (error) {
      console.log(error);

      setLoading(false);
      setError(true)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Signup</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="text" placeholder='username' id='username' className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <input type="email" placeholder='email' id='email' className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <input type="password" placeholder='password' id='password' className='bg-slate-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-90'>
          {loading ? "...loading" : "Sign up"}
        </button>
      </form>
      <div className='flex gap-4 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>
      <p className='text-red-400'>{error && "something went wrong"}</p>
    </div>
  )
}
