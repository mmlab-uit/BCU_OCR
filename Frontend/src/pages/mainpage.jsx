// import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
// import {MainContainer,ChatContainer,MessageList,Message,MessageInput,TypingIndicator,} from "@chatscope/chat-ui-kit-react";
import img from "../imgs/img";
import {useNavigate} from "react-router-dom"
export const Mainpage = () => {
    const navigate = useNavigate()
    return (
        <>  
            <div className="font-mono bg-gray-900">
                <div className='md:m-auto flex flex-col flex-wrap text-wrap w-auto h-auto pt-[12rem] pb-[9rem]' style={{maxWidth:"1450px"}} >
                    <div className="flex flex-wrap w-auto h-auto gap-4">
                        <div className="flex flex-col flex-nowrap gap-6 flex-1">
                            <div className="w-fit flex gap-4">
                                <h1 className="md:text-7xl text-4xl text-wrap text-yellow-400">OCR</h1>
                                <h1 className="md:text-7xl text-4xl text-wrap text-yellow-400 text-animation">SERVICES</h1>
                            </div>
                            <h2 className="md:text-lg text-lg text-white">PAN extracts all data relevant to you from documents and provides it for use in your purposes, PAN is the right solution for you, if you:</h2>
                            <div className="flex ml-5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-yellow-400">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                                <h3 className="ml-2 text-white">Need a standard OCR, for example to extract invoices, or our solution fo rremittance advices </h3>
                            </div>
                            <div className="flex ml-5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-yellow-400">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                                <h3 className="ml-2 text-white">Need to process a lot of documents and are looking for an individual solution to make your work easier</h3>
                            </div>
                            <div className="flex ml-5 gap-3">
                                <button className=" text-white border-4 w-fit md:p-2 md:pl-7 md:pr-7 md:text-lg  text-sm rounded-full p-1 hover:bg-yellow-400" onClick={() => navigate("/process")}>Get started with our services</button>
                                <button className=" text-white border-4 w-fit md:p-2 md:pl-7 md:pr-7 md:text-lg  text-sm rounded-full p-1 hover:bg-yellow-400">Find out more</button>
                            </div>
                        </div>
                        <img className="w-auto h-auto lg:block hidden" src={img.hoadonocr} alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

