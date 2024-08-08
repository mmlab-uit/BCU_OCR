import img from "../imgs/img";
import { useNavigate } from "react-router-dom";

function Policy(){
    const navigate = useNavigate();
    return(
        <>
            <div className=" font-mono bg-gray-900">
                <div className='md:m-auto flex flex-col flex-wrap text-wrap pb-16 pt-[9rem]' style={{maxWidth:"1450px"}} >
                    <div className="flex justify-center flex-wrap w-auto h-auto">
                        <div className="flex flex-col items-center mt-9">
                            <h1 className="md:text-2xl text-md text-yellow-400">Privacy Policy</h1>
                            {/* <h1 className="break-words text-center mt-2 md:text-3xl text-lg font-bold text-gray-200" style={{maxWidth : "52rem"}}>Currently we provide standardized solutions for the following document types.</h1> */}
                        </div>
                    </div>
                    <div className=" px-[12rem] py-14 mt-4 flex flex-col gap-[2.5rem]">
                        <div className="relative">
                            <div className="relative z-50 rounded-3xl text-white p-3 text-center text-2xl bg-gray-600">
                                1. Thu thập thông tin 
                            </div>
                            <div className="px-[0.9rem] mt-[-9px]">
                                <div className="bg-gray-100 border-[10px] border-gray-600 relative rounded-md p-[1rem] font-[500] text-lg">
                                Chúng tôi có thể thu thập các loại thông tin sau: <br></br> <br></br>
                                Thông tin cá nhân: Khi bạn đăng ký tài khoản hoặc sử dụng dịch vụ, chúng tôi có thể thu thập thông tin 
                                như tên, địa chỉ email, số điện thoại, và thông tin thanh toán. <br></br> <br></br>
                                Thông tin tài liệu: Các tài liệu bạn tải lên để xử lý OCR sẽ được lưu trữ và xử lý bởi hệ thống của chúng 
                                tôi.
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-50 rounded-3xl text-white p-3 text-center text-2xl bg-gray-600">
                                2. Sử dụng thông tin 
                            </div>
                            <div className="px-[0.9rem] mt-[-9px]">
                                <div className="bg-gray-100 border-[10px] border-gray-600 relative rounded-md p-[1rem] font-[500] text-lg">
                                Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:<br></br> <br></br>
                                Cung cấp và duy trì dịch vụ OCR. <br></br> <br></br>
                                Cải thiện và tối ưu hóa hiệu suất của trang web. <br></br> <br></br>
                                Liên lạc với bạn về các cập nhật, khuyến mãi, hoặc hỗ trợ kỹ thuật. <br></br><br></br>
                                Bảo mật thông tin và ngăn chặn các hành vi gian lận. 
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-50 rounded-3xl text-white p-3 text-center text-2xl bg-gray-600">
                                3. Chia sẻ thông tin 
                            </div>
                            <div className="px-[0.9rem] mt-[-9px]">
                                <div className="bg-gray-100 border-[10px] border-gray-600 relative rounded-md p-[1rem] font-[500] text-lg">
                                Chúng tôi không bán, trao đổi, hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba. Chúng tôi có thể 
                                chia sẻ thông tin của bạn trong các trường hợp sau: <br></br> <br></br>
                                Với các nhà cung cấp dịch vụ: Các bên thứ ba giúp chúng tôi vận hành trang web và cung cấp dịch vụ, họ 
                                sẽ được yêu cầu bảo vệ thông tin của bạn theo các điều khoản bảo mật nghiêm ngặt. <br></br> <br></br>
                                Cải thiện và tối ưu hóa hiệu suất của trang web. <br></br> <br></br>
                                Theo yêu cầu pháp lý: Khi chúng tôi tin rằng việc tiết lộ thông tin là cần thiết để tuân thủ pháp luật, bảo 
                                vệ quyền lợi hoặc an ninh của chúng tôi và người dùng. 
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-50 rounded-3xl text-white p-3 text-center text-2xl bg-gray-600">
                                4. Bảo mật thông tin 
                            </div>
                            <div className="px-[0.9rem] mt-[-9px]">
                                <div className="bg-gray-100 border-[10px] border-gray-600 relative rounded-md p-[1rem] font-[500] text-lg">
                                Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn khỏi mất mát, truy 
                                cập trái phép, hoặc tiết lộ.
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-50 rounded-3xl text-white p-3 text-center text-2xl bg-gray-600">
                                5. Quyền riêng tư của trẻ em 
                            </div>
                            <div className="px-[0.9rem] mt-[-9px]">
                                <div className="bg-gray-100 border-[10px] border-gray-600 relative rounded-md p-[1rem] font-[500] text-lg">
                                Trang web này không dành cho trẻ em dưới 13 tuổi và chúng tôi không cố ý thu thập thông tin từ trẻ em. 
                                Nếu chúng tôi phát hiện ra rằng đã thu thập thông tin từ trẻ em dưới 13 tuổi, chúng tôi sẽ xóa thông tin đó 
                                ngay lập tức. 
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-50 rounded-3xl text-white p-3 text-center text-2xl bg-gray-600">
                                6. Quyền của bạn 
                            </div>
                            <div className="px-[0.9rem] mt-[-9px]">
                                <div className="bg-gray-100 border-[10px] border-gray-600 relative rounded-md p-[1rem] font-[500] text-lg">
                                Bạn có quyền truy cập, chỉnh sửa, hoặc xóa thông tin cá nhân của mình. Bạn cũng có quyền phản đối việc 
                                xử lý thông tin của mình hoặc yêu cầu hạn chế xử lý. Để thực hiện các quyền này, vui lòng liên hệ với 
                                chúng tôi qua [Thông tin liên hệ]. 
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-50 rounded-3xl text-white p-3 text-center text-2xl bg-gray-600">
                                7. Thay đổi chính sách 
                            </div>
                            <div className="px-[0.9rem] mt-[-9px]">
                                <div className="bg-gray-100 border-[10px] border-gray-600 relative rounded-md p-[1rem] font-[500] text-lg">
                                Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được thông báo trên trang web 
                                của chúng tôi và có hiệu lực ngay khi đăng tải. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng 
                                nghĩa với việc bạn chấp nhận các điều khoản mới. 
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-50 rounded-3xl text-white p-3 text-center text-2xl bg-gray-600">
                                8. Liên hệ  
                            </div>
                            <div className="px-[0.9rem] mt-[-9px]">
                                <div className="bg-gray-100 border-[10px] border-gray-600 relative rounded-md p-[1rem] font-[500] text-lg">
                                Nếu bạn có bất kỳ câu hỏi nào về chính sách này, vui lòng liên hệ với chúng tôi qua: <br></br><br></br>
                                Email: admin@gmail.com <br></br><br></br>
                                Số điện thoại: 0988888888 <br></br><br></br>
                                Địa chỉ: Trường Đại học Công nghệ thông tin, đường Hàn Thuyên, khu phố 6, thành phố Thủ Đức, Thành 
                                phố Hồ Chí Minh 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Policy;