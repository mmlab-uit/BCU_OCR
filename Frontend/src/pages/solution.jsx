import img from "../imgs/img"
import { useNavigate } from "react-router-dom"

function Solution () {
    const navigate = useNavigate();
    return (
        <>
            <div className="font-mono bg-gray-900">
                <div className='md:m-auto flex flex-col flex-wrap text-wrap pb-16 pt-[9rem] gap-[4rem] ' style={{maxWidth:"1450px"}} >
                    <div className="flex justify-center flex-wrap w-auto h-auto">
                        <div className="flex flex-col items-center mt-9">
                            <h1 className="md:text-2xl text-md text-yellow-400">SOLUTIONS</h1>
                            <h1 className="break-words text-center mt-2 md:text-3xl text-lg font-bold text-gray-200" style={{maxWidth : "52rem"}}>We offers individual solutions for the most diverse requirements, applications and target groups</h1>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 grid-cols-1 mt-5 gap-7">
                        <div className="flex flex-col justify-center items-center rounded-2xl p-5 gap-5 bg-gray-300" style={{boxShadow: "0 5px 40px rgba(0, 0, 0, 0.1)"}}>
                            <img className=" md:h-44 h-32" src={img.invoice} alt="" />
                            <h1 className="font-extrabold md:text-2xl text-lg">Invoices and receipts</h1>
                            <h3 className="lg:text-lg text-center text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h3>
                            <button className="flex items-center gap-2 text-white w-fit md:p-2 md:pl-7 md:pr-7 md:text-lg  text-sm rounded-full p-1 bg-yellow-400 hover:bg-yellow-300" onClick={() => navigate("/integration")}>
                                Get started
                                <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col justify-center items-center rounded-2xl p-5 gap-5 bg-gray-300" style={{boxShadow: "0 5px 40px rgba(0, 0, 0, 0.1)"}}>
                            <img className=" md:h-44 h-32" src={img.invoice} alt="" />
                            <h1 className="font-extrabold md:text-2xl text-lg">Invoices and receipts</h1>
                            <h3 className="lg:text-lg text-center text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h3>
                            <button className="flex items-center gap-2 text-white w-fit md:p-2 md:pl-7 md:pr-7 md:text-lg  text-sm rounded-full p-1 bg-yellow-400 hover:bg-yellow-300" onClick={() => navigate("/integration")}>
                                Get started
                                <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col justify-center items-center rounded-2xl p-5 gap-5 bg-gray-300" style={{boxShadow: "0 5px 40px rgba(0, 0, 0, 0.1)"}}>
                            <img className=" md:h-44 h-32" src={img.invoice} alt="" />
                            <h1 className="font-extrabold md:text-2xl text-lg">Invoices and receipts</h1>
                            <h3 className="lg:text-lg text-center text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h3>
                            <button className="flex items-center gap-2 text-white w-fit md:p-2 md:pl-7 md:pr-7 md:text-lg  text-sm rounded-full p-1 bg-yellow-400 hover:bg-yellow-300" onClick={() => navigate("/integration")}>
                                Get started
                                <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        </div> 
                    </div>
                </div>
            </div>
        </>
    )
}
export default Solution