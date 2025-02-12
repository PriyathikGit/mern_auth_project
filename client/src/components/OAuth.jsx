import React from 'react'
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { app } from '../firebase';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../features/UserSlice';
import { useNavigate } from "react-router-dom"
const OAuth = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const handleGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app); // passing the firebase config so it can verify
            const result = await signInWithPopup(auth, provider);
            const res = await axios.post('/api/auth/google', {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL
            })
            const data = res.data;
            dispatch(signInSuccess(data));
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <button type='button'
            onClick={handleGoogle}
            className='bg-red-700 text-white p-3 uppercase rounded-lg hover:opacity-90 cursor-pointer'>Continue with google</button>
    )
}

export default OAuth