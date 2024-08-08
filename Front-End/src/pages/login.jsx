import React, { useContext } from 'react'
import { useState,useEffect } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import {doSignInWithEmailAndPassword,doPasswordReset} from "../Firebase/auth"
import { Usercontext } from '../App'
import { auth } from '../Firebase/firebase-config'
function Login () {
    const { userLoggedIn } = useContext(Usercontext);

    const navigate = useNavigate();


    const [sendemailreset ,setsendemailreset] = useState('');
    const [sendedemail,setsendedemail] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [forgotpass,setforgotpass] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [notverified,setnotverified] = useState(false);


    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await doSignInWithEmailAndPassword(email, password);
            } catch (error) {
                setIsSigningIn(false);
                console.log(error);
                setErrorMessage("Wrong password or invalid account!"); // Set error message from Firebase
            }
        }
    };

    useEffect(() => {
        let timer;
        if (sendedemail) {
          timer = setTimeout(() => {
            setsendedemail(false);
          }, 5000);
        }
        return () => clearTimeout(timer);
      }, [sendedemail]);

    useEffect(() => {
        if (userLoggedIn) {
            if(auth?.currentUser?.emailVerified === false){
                // console.log(`email is not verified yet!`)
                setnotverified(true);
            }
            if(auth?.currentUser?.emailVerified){
                setnotverified(false);
                navigate("/");
            }
        }
    }, [userLoggedIn,navigate]);



    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center pt-[15rem] pb-[15rem]">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                </div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                    {
                        notverified == true ? (
                            <h2 id='login-text-custom' className="text-center text-2xl font-semibold mb-4">Please verify your email</h2>
                        ) : (
                            <>
                                <div>
                                    <h1 className="text-3xl font-semibold">Please Login to Dashboard</h1>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    <form onSubmit={onSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                        <div className="relative">
                                            <input id="email" name="email" type="text" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div className="relative">
                                            <input id="password" name="password" type="password" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" required value={password} onChange={(e)=> setPassword(e.target.value)} />
                                        </div>
                                        <div>
                                            <p>{errorMessage ? <span className='text-red-500 text-md'>Email or Password is not valid!</span> : ''}</p>
                                            <p className='text-base mt-1'>If you haven't an account. Please create here <Link to='/sign' className='underline text-blue-600'>Sign Up</Link></p>

                                        </div>
                                        <div className="relative">
                                            <button type='submit' className="bg-blue-500 text-white rounded px-6 py-1" disabled={isSigningIn} >{isSigningIn ? "Signing In..." : "Sign In"}</button>
                                        </div>
                                    </form>
                                    {
                                        forgotpass ? (                                
                                            <form className='mt-2' onSubmit={(e) => {doPasswordReset(sendemailreset); e.preventDefault(); setforgotpass(false); setsendedemail(true) }}>
                                                <label id='login-text-custom' htmlFor="resetpassword" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Enter your gmail
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    autoComplete="email"
                                                    required
                                                    value={sendemailreset}
                                                    onChange={(e) => setsendemailreset(e.target.value)}
                                                    className="mt-1 mb-4 block w-full px-3 py-2 border-2 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
                                                />
                                                <button
                                                    type="submit"
                                                    // disabled={isSigningIn}
                                                    className={`w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md ${isSigningIn ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                                                >
                                                    Send Email.
                                                    {/* {isSigningIn ? 'Signing In...' : 'Sign In'} */}
                                                </button>
                                            </form>
                                        ):(
                                            <>
                                                {
                                                    sendedemail ? (
                                                        <p id='reset-text-custom' className="text-center text-lg mt-3 text-red-500">Đã gửi resetpassword qua email.</p>
                                                    ):(
                                                        <>
                                                            <p id='login-text-custom' className="text-center text-sm mt-3">Forgot password? <span className="text-indigo-600 font-semibold hover: cursor-pointer" onClick={()=> setforgotpass(true)}>Reset Password</span></p>
                                                        </>
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                </div>
                            </>
                        )
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
