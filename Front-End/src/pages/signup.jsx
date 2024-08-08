import React from 'react'
import { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import {doCreateUserWithEmailAndPassword} from "../Firebase/auth"
function Sign () {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [username,setusername] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match');
                setIsRegistering(false);
                return;
            }
            try {
                await doCreateUserWithEmailAndPassword(email, password, username);
                navigate('/login'); // Redirect to login after successful registration
            } catch (error) {
                setIsRegistering(false);
                if (error.code === 'auth/email-already-in-use') {
                    setErrorMessage(`${email} is already been used`);
                } else {
                    setErrorMessage(error.message); // Set more informative error message
                }
            }
        }
    };


    return (
        <div className="min-h-screen bg-gray-900  flex flex-col justify-center pt-[15rem] pb-[15rem]">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                </div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-3xl font-semibold">Please Create An Account</h1>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <form onSubmit={onSubmit} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="relative">
                                    <input id="username" name="username" type="text" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="username" required value={username} onChange={(e) => setusername(e.target.value)}/>
                                </div>
                                <div className="relative">
                                    <input id="email" name="email" type="email" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="relative">
                                    <input id="password" name="password" type="password" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="relative">
                                    <input id="confirm_password" name="confirm_password" type="password" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Confirm password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                                <div className="relative flex items-center">
                                    <input id="checkbox" name="checkbox" type="checkbox" className='mr-3 size-7' required />
                                    <label htmlFor="" className=''>I accept web's <u className='hover:cursor-pointer text-blue-600' onClick={()=>navigate("/privacy-policy")}>Privacy Policy</u></label>
                                </div>
                                <div>
                                    <p className='text-base'>If you have an account. Please <Link to='/login' className='underline text-blue-600'>Login Now</Link> here</p>
                                </div>
                                <div className="relative">
                                    <button type='submit' className={`bg-blue-500 text-white rounded px-6 py-1 ${isRegistering ? "cursor-not-allowed opacity-10" : "cursor-pointer"}`} disabled={isRegistering}>{isRegistering ? "Signing..." : "Sign up"}</button>
                                </div>
                                <p>{errorMessage ? <span className='text-red-500 text-md'>{errorMessage}</span> : ''}</p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sign
