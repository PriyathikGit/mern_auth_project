import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const Header = () => {
    const { currentUser } = useSelector((state) => state.user)
    return (
        <div className='bg-slate-200'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to={"/"}>
                    <h1 className='font-bold'>Auth App</h1>
                </Link>
                <ul className='flex gap-4 items-center'>
                    <Link to={"/"}><li>Home</li></Link>
                    <Link to={"/about"}><li>About</li></Link>
                    {
                        currentUser ?
                            <Link to={"/profile"}><img
                                className='w-10 h-10 rounded-full cursor-pointer'
                                src={currentUser?.rest?.profilePicture} alt="pfp" /></Link> :
                            <Link to={"/sign-in"}><li>Sign in</li></Link>
                    }
                </ul>
            </div>
        </div>
    )
}
