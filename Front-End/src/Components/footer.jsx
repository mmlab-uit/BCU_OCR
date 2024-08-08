import React from 'react'
import img from '../imgs/img'
import { useNavigate } from 'react-router-dom'

export const Footer = () => {
    const navigate = useNavigate();
  return (
    <div className='bg-gray-600'>
        <div className='max-w-[1450px] flex flex-col flex-wrap gap-2 m-auto text-white font-mono'>
            <div className='flex flex-wrap w-full justify-evenly pt-10 pb-10'>
                <img className='w-[7rem]' src={img.logo} alt="" />
                <div className='flex flex-col gap-1'>
                    <div className='text-3xl'>Contact us</div>
                    <div className='flex gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                        <div className='text-lg'>admin@gmail.com</div>
                    </div>
                    <div className='flex gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                        <div className='text-lg'>0900666666</div>
                    </div>  
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='text-3xl'>LEGAL</div>
                    <div className='flex gap-2'>
                        <div className='text-lg cursor-pointer' onClick={()=> navigate("/privacy-policy")}>Privacy Policy</div>
                    </div>  
                </div>
            </div>
        </div>
    </div>
  )
}
