import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { signInFailure, signInStart, signInSuccess } from "../features/UserSlice"
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export const Sign_In = () => {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user); // the name of the state is user in redux
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }) //{id:value}
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart())
      const response = await axios.post("/api/auth/signin", formData);
      const data = response.data;
      dispatch(signInSuccess(data))
      navigate("/")
    } catch (error) {
      console.log(error);
      dispatch(signInFailure(error.response.data.message));
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
        <OAuth/>
      </form>
      <div className='flex gap-4 mt-5'>
        <p>Create an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-500'>Sign up</span>
        </Link>
      </div>
      <p className='text-red-400'>{error ? error || "something went wrong" : ""}</p>
    </div>
  )
}
