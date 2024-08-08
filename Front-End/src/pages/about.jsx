import React, { useState } from 'react';
import img from "../imgs/img"; // Adjust the path according to your file structure

function About() {
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);


  return (
    <div className="pt-[17rem] bg-gray-800 pb-[17rem] font-mono">
      <div className='m-auto'>
        <div className='text-white'>
          <div className='mb-14 text-center font-semibold text-4xl'>OUR TEAM MEMBERS</div>
          <div className='flex flex-wrap justify-center gap-5'>
            <div 
              className='group min-w-[15rem] h-[30rem] flex flex-col justify-center gap-2 items-center opacity-70 hover:bg-gradient-to-r from-black via-gray-600 to-red-900 hover:opacity-100 bg-gray-900 relative'
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}>
              <div className='rounded-full w-[8rem] h-[8rem] overflow-hidden z-10'>
                <img src={hovered ? img.patrick2 : img.patrick} alt="member" className='w-fit h-fit object-cover border-none'/>
              </div>
              {
                hovered && (
                  <>
                    <div id='patrick_knife' className=' z-20'>
                      <img src={img.knife} className='size-[8rem] relative' alt="" />
                    </div>
                    <div className=' absolute top-0 z-10'>
                      <img src={img.blood} alt="" />
                    </div>
                    <div className=' absolute bottom-0 transform rotate-180 z-10'>
                      <img src={img.blood} alt="" />
                    </div>
                    <div className='absolute bottom-[1rem] z-10'>
                      <img src={img.card} className='w-auto h-[7rem] transform skew-x-6 -rotate-2' alt="" />
                    </div>
                    <div className='absolute top-[13rem] text-gray-800 bg-gray-200 p-1 rounded-xl right-[3.5rem] text-base transform -rotate-[20deg] z-20'>
                      Hey <span className='line-through text-red-800'>Paul</span>🪓
                    </div>
                  </>
                )
              }
              <div className='text-xl group-hover:italic group-hover:font-semibold z-10'>Phuc</div>
              {/* <div className='text-xl opacity-0 -translate-x-14 group-hover:opacity-100 group-hover:translate-x-0 transform transition-all duration-500 text-center'>(AKA Ryan)</div> */}
              <div className='text-xl opacity-0 translate-y-12 group-hover:opacity-100 group-hover:translate-y-0 transform transition-all duration-500 text-center group-hover:text-red-200 group-hover:font-extrabold z-10'>Web Developer</div>
              <img src={img.american} alt="" className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-50" />
              
            </div>

            <div className={`group min-w-[15rem] h-[30rem] flex flex-col justify-center gap-2 items-center opacity-70 hover:opacity-100 hover:bg-gray-600 bg-gray-900 relative`}>
              <div className={'rounded-full w-[8rem] h-[8rem] overflow-hidden z-10'}>
                <img src={img.tuan_anh} alt="member" className={"object-cover"}/>
              </div>
              <div className='text-xl group-hover:italic group-hover:font-semibold z-10 '>Tuan Anh</div>
              <div className='text-xl opacity-0 translate-y-12 group-hover:opacity-100 group-hover:translate-y-0 transform transition-all duration-500 text-center font-semibold text-yellow-200 z-10'>Web Developer</div>
              <img src={img.ronaldobackground} alt="" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-50" />
            </div>

            <div className='group min-w-[15rem] h-[30rem] flex flex-col justify-center gap-2 items-center opacity-70 hover:bg-gray-600 hover:opacity-100 bg-gray-900'>
              <div className='rounded-full w-[8rem] h-[8rem] overflow-hidden'>
                <img src={img.nguyen} alt="member" className='w-fit h-fit object-contain border-none'/>
              </div>
              <div className='text-xl'>Nguyen</div>
              <div className='text-xl opacity-0 translate-y-12 group-hover:opacity-100 group-hover:translate-y-0 transform transition-all duration-500 text-center'>Backend & API searcher</div>
            </div>
            <div className='group min-w-[15rem] h-[30rem] flex flex-col justify-center gap-2 items-center opacity-70 hover:bg-gray-600 hover:opacity-100 bg-gray-900'>
              <div className='rounded-full w-[8rem] h-[8rem] overflow-hidden'>
                <img src={img.huy} alt="member" className='w-fit h-fit object-contain border-none'/>
              </div>
              <div className='text-xl'>Huy</div>
              <div className='text-xl opacity-0 translate-y-12 group-hover:opacity-100 group-hover:translate-y-0 transform transition-all duration-500 text-center'>AI Trainer</div>
            </div>
            <div className='group min-w-[15rem] h-[30rem] flex flex-col justify-center gap-2 items-center opacity-70 hover:bg-gray-600 hover:opacity-100 bg-gray-900'>
              <div className='rounded-full w-[8rem] h-[8rem] overflow-hidden'>
                <img src={img.ngan} alt="member" className='w-fit h-fit object-contain border-none'/>
              </div>
              <div className='text-xl'>Ngan</div>
              <div className='text-xl opacity-0 translate-y-12 group-hover:opacity-100 group-hover:translate-y-0 transform transition-all duration-500 text-center'>Mobile Developer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
