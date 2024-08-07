import img from "../imgs/img";
import { useState,useRef, useEffect,useContext} from "react";
import Webcam from 'react-webcam';
import { Usercontext } from "../App";
import Modal from "./Modal";
import "react-image-crop/dist/ReactCrop.css";
import { auth,db,storage } from "../Firebase/firebase-config";
import { ref, uploadBytes, getDownloadURL,getBlob  } from 'firebase/storage';

import {setDoc,doc,getDoc } from "firebase/firestore";

// 

function Process() {


    const [selectedFile, setSelectedFile] = useState(null);
    const {imgurl , setImgUrl} = useContext(Usercontext)
    const [ocrvalue, setocrvalue] = useState("");
    const [ocrjson, setocrjson] = useState("");
    const [processing, setProcessing] = useState(false);
    const [switchtype, setswitchtype] = useState("text");
    const [error, seterror] = useState("");
    const [inputservice, setinputservice] = useState("");
    const [showform,setshowform] = useState(false);
    const [deletefield,setdeletefield] = useState(false);
    const [addvalue,setaddvalue] = useState("");
    const [modifyfield , setmodifyfield] = useState(false);
    const [objectfield,setobjectfield] = useState({});
    const [modifyvalue,setmodifyvalue] = useState();
    const [originalvalue , setoriginalvalue] = useState();
    const [collectprocess,setcollectprocess] = useState(false);
    const [collecterror,setcollecterror] = useState("");
    const [croperror,setcroperror] = useState("");
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [shareurl,setshareurl] = useState("");
    const [urlprocess,seturlprocess]= useState(false);
    const webcamRef = useRef(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [triggersubmitproduct,settriggersubmitproduct] = useState(false);
    const [imgname,setimgname] = useState("");

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    
  const getCurrentDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file);
        setimgname(file.name);

        // Optionally, generate a preview (not needed for upload)
        const reader = new FileReader();
        reader.onloadend = () => {
            setImgUrl(reader.result); // Only for preview purposes
        };
        reader.readAsDataURL(file);
    }
};


    const onsubmitproduct = async () => {
        try {
            const user = auth.currentUser;
            const date = getCurrentDateTime();
            const email = user.email.replace(/[@.]/g, '_'); // Replace @ and . to avoid issues in the filename
            const fileName = `${email}_${date}.${selectedFile.type.split('/')[1]}`; // e.g., user_email_2024-08-02-14-30-00.jpg
            const storageRef = ref(storage, `images/${fileName}`);
      
            // Upload the file to Firebase Storage
            const snapshot = await uploadBytes(storageRef, selectedFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            // const shorturl= await tinyimgurl(imgurl);
            const documentPath = `${auth?.currentUser?.email}`;
            const productDoc = doc(db, "history", documentPath);
            const dataToUpdate = {
                [date]: {
                    // ocr_text: ocrvalue ? ocrvalue.raw_text : "",
                    ocr_json: objectfield ? JSON.stringify(objectfield) : "",
                    ocr_picture: downloadURL, // Add the image URL to Firestore
                    date: date
                }
            };
            await setDoc(productDoc, dataToUpdate, { merge: true });
            // console.log("Document updated successfully");
        } catch (err) {
            console.error(err);
        }
    };
    // let arrayraw_text = [
    //     [
    //         "1000",
    //         "201548323",
    //         "590",
    //         "1590",
    //         "1",
    //         "đề nghị thanh toán đúng hạn",
    //         "phạm hợp đống và lãi suất phạt chậm trả,",
    //         "điện tiều thụ(kwh)",
    //         "hệ số nhân",
    //         "chỉ số mới",
    //         "công tơ đo đếm",
    //         "chỉ số cũ",
    //         "để tránh phát sinh các chi phí phạt vi",
    //         "21/05/2019",
    //         "kỳ hoá đơn:tháng 5/2019(30 ngày từ 15/04/2019 đến 14/05/2019)",
    //         "hạn thanh toán",
    //         "tỉnh hình sử dụng điện của khách hàng",
    //         "1.611.643 đồng",
    //         "số hộ sử dụng điện",
    //         "1",
    //         "tiền thanh toán",
    //         "sinh hoạt",
    //         "mục đích sử dụng điện",
    //         "hàng khoai,hoàn kiếm,hà nội",
    //         "địa chỉ",
    //         "pd010000010383",
    //         "mã khách hàng",
    //         "khách hàng",
    //         "nguyễn quốc a",
    //         "(bản thể hiện của hoá đơn điện tử)",
    //         "hỏa đơn giá trị gia tăng(tiền điện)",
    //         "số:0233044",
    //         "mst:010010114-001",
    //         "evn",
    //         "ký hiệu:aa/19e",
    //         "quận hoàn kiểm,hà nội",
    //         "69c đinh tiền hàng,phường lý thái tổ,",
    //         "mẫu số:01gtkto/001",
    //         "công ty điện lực hoàn kiếm",
    //         "1900 1288",
    //         "tổng công ty điện lực tp hà nội"
    //     ]
    // ];
    // let flattenedArray = arrayraw_text.flat(); // Flatten the array
    // let formattedText = flattenedArray.join("\n"); // Join with newline characters
    const isFileExtensionAllowed = (filename) => {
        const fileExtension = filename.split('.').pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
    };

    const [productlist2,setproductlist2]=useState();   

    const sendFiles = async (e) => {
        e.preventDefault();
        setocrvalue("");
        try {
            setProcessing(true);
    
            // Check for necessary conditions
            if (!inputservice) {
                throw new Error("Please select a service");
            }
            if (!auth?.currentUser?.email) {
                throw new Error("Please login to use our services");
            }
            if (auth?.currentUser?.email && !auth?.currentUser?.emailVerified) {
                throw new Error("Please verify your email");
            }
    
            const formData = new FormData();
            const myFiles = document.getElementById('myFiles').files;
    
            for (let i = 0; i < myFiles.length; i++) {
                const file = myFiles[i];
                const isAllowed = isFileExtensionAllowed(file.name);
                if (!isAllowed) {
                    throw new Error("We only allow file PDF, TIFF, JPEG, and PNG.");
                }
                if(inputservice ==="Viet_OCR"){
                    formData.append("image",file);
                }else{
                    formData.append('file', file);
                }
            }
    
            if (myFiles.length <= 0) {
                throw new Error("Please select a file");
            }
            if (!productlist2) {
                throw new Error("You haven't generated any key yet!");
            }
            if(!productlist2.PAN_key){
                throw new Error("You haven't generated PAN API key yet!");
            }
    
            if (inputservice === "Veryfi") {
                if (!productlist2.Client_id || !productlist2.Client_secret || !productlist2.Username || !productlist2.Veryfikey) {
                    throw new Error("Please fill all property for Veryfi at KEYS");
                }
                const response = await fetch(`https://fastapi-r12h.onrender.com/text-extraction?service=${inputservice}&client_id=${productlist2.Client_id}&client_secret=${productlist2.Client_secret}&username=${productlist2.Username}&api_key=${productlist2.Veryfikey}&PAN_api_key=${productlist2.PAN_key}`, {
                    method: 'POST',
                    body: formData
                });
    
                if (!response.ok) {
                    throw new Error('Your Veryfi KEYS are invalid or Expired!');
                }
    
                const json = await response.json();
                setocrvalue(json);
                localStorage.setItem("ocrvalue", JSON.stringify(json)); // Store json directly
                setProcessing(false);
                seterror("");
                setswitchtype("text");
            }
    
            if (inputservice === "GG_vision") {
                if(!productlist2.filename){
                    throw new Error("You haven't input file for GG_vision keys at KEYS");
                }
                if(!productlist2.client_id || !productlist2.client_email || !productlist2.auth_provider_x509_cert_url){
                    throw new Error("Missing some properties,Please input file from GG_vision services")
                }
                // Create JSON object
                const jsonObject = {
                    type: productlist2.type,
                    project_id: productlist2.project_id,
                    private_key_id: productlist2.private_key_id,
                    private_key: productlist2.private_key,
                    client_email: productlist2.client_email,
                    client_id: productlist2.client_id,
                    auth_uri: productlist2.auth_uri,
                    token_uri: productlist2.token_uri,
                    auth_provider_x509_cert_url:productlist2.auth_provider_x509_cert_url,
                    client_x509_cert_url: productlist2.client_x509_cert_url,
                    universe_domain: productlist2.universe_domain,
                };
            
                // Convert JSON object to Blob
                const jsonBlob = new Blob([JSON.stringify(jsonObject)], { type: 'application/json' });
            
                // Create FormData and append the Blob as a file
                formData.append('gg_vision_key', jsonBlob, 'service_key.json');

                const response2 = await fetch(`https://fastapi-r12h.onrender.com/text-extraction?service=${inputservice}&PAN_api_key=${productlist2.PAN_key}`, {
                    method: 'POST',
                    body: formData
                });
    
                if (!response2.ok) {
                    throw new Error('Your GG_vision KEYS are invalid or Expired');
                }
    
                const json = await response2.json();
                setocrvalue(json);
                localStorage.setItem("ocrvalue", JSON.stringify(json)); // Store json directly
                setProcessing(false);
                seterror("");
                setswitchtype("text");
            }if(inputservice === "Viet_OCR"){
                var background_removal=1
                var text_correction=1
                formData.append('background_removal',background_removal);
                formData.append('text_correction',text_correction);
                const response=await fetch('https://xoebif6n3f6cc5rsbcruhkgney0zfirk.lambda-url.ap-southeast-1.on.aws/',{
                    method:'POST',
                    body:formData
                })
                const json = await response.json(); 
                const result=json['result']
                let flattenedArray = result.text.flat(); // Flatten the array
                let reversedarray = flattenedArray.reverse();
                let formattedText = reversedarray.join("\n"); // Join with newline characters
                setocrvalue(formattedText);
                localStorage.setItem("ocrvalue", JSON.stringify(formattedText)); // Store json directly
                setProcessing(false);
                seterror("");
                setswitchtype("text");
            }
        } catch (err) {
            setProcessing(false);
            seterror(err.message);
        }
    };
    
    
    
    
    
    useEffect(() => {
        const localocrvalue = localStorage.getItem("ocrvalue");
        const localocrjson = JSON.parse(localStorage.getItem("ocrjson"));
        // const ocrpicture = localStorage.getItem("uploadedImage");
        if (localocrvalue) {
            // console.log(`localocrvalue: `, localocrvalue);
            setocrvalue(JSON.parse(localocrvalue)); // Parse the JSON string back to an object
        }
        if(localocrjson){
            // console.log(`found localocrjson`)
            setocrjson(localocrjson);
            // const cleanedJsonString = ocrjson.reply.replace(/```json\n|```/g, '');

            // const parsedObject = JSON.parse(cleanedJsonString);

            // setobjectfield(parsedObject);
        }
        // if(ocrpicture){
        //     setImgUrl(ocrpicture);
        //     // console.log(`ocrpicture:`,ocrpicture)
        // }


    }, []);

    const clearall = () => {
        localStorage.clear();
        window.location.reload();
    }

    // localStorage.clear();
    

    const convertjson = async () => {
        try{
            settriggersubmitproduct(true);
            setcollectprocess(true);
            if (Object.keys(objectfield).length === 0 && objectfield.constructor === Object) {
                throw new Error("You haven't config template yet.");
            }

            const encodedRawText = encodeURIComponent(ocrvalue.raw_text);
            const encodedocrvalue = encodeURIComponent(ocrvalue)
            const encodedTemplate = encodeURIComponent(JSON.stringify(objectfield));
            // console.log(encodedocrvalue);
            // console.log(ocrvalue);
            let mainencoded
            if(encodedRawText !== "undefined"){
                mainencoded = encodedRawText;
            }else{
                mainencoded = encodedocrvalue;
            }
            // console.log(mainencoded);

            const response = await fetch(`https://fastapi-r12h.onrender.com/convert?raw_text=${mainencoded}&template=${encodedTemplate}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });

            const json = await response.json();
            if (!response.ok) {
                throw new Error(json.msg);
            }
            setocrjson(json);
            setcollectprocess(false);
            setcollecterror("");
            localStorage.setItem("ocrjson",JSON.stringify(json))
            // localStorage.setItem('uploadedImage', imgurl);

        }catch(err){
            console.log(err.message);
            setcollecterror(err.message);
            setcollectprocess(false);
        }
    }

    useEffect(() => {
        if(ocrjson){
            const cleanedJsonString = ocrjson.reply.replace(/```json\n|```/g, '');
            // console.log(`cleanedjson string : ${cleanedJsonString}`);

            const parsedObject = JSON.parse(cleanedJsonString);

            setobjectfield(parsedObject);
            // console.log(`${JSON.stringify(objectfield)}`)
        }
    },[ocrjson])

    const handleDownload = (objectfield) => {
        // Convert object to JSON string with pretty-print (2 spaces for indentation)
        const jsonString = JSON.stringify(objectfield, null, 2);
        
        // Create a Blob from the JSON string
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);
        
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = url;
        link.download = 'info.json';
        
        // Append the anchor to the body
        document.body.appendChild(link);
        
        // Programmatically click the anchor to trigger the download
        link.click();
        
        // Remove the anchor from the body
        document.body.removeChild(link);
        
        // Revoke the Blob URL to free up resources
        URL.revokeObjectURL(url);
    };
    
    const handleShare = async (objectfield) => {
        const jsonString = JSON.stringify(objectfield);
        const encodedJsonString = encodeURIComponent(jsonString);
        const longUrl = `${window.location.origin}/share?objectfield=${encodedJsonString}`;
    
        try {
            seturlprocess(true);
            const response = await fetch(`https://api.tinyurl.com/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eTjWEHD5vJb56KLAWgpDGBSN8yUVgkqBaegy0zJY6U6Kjiox7hfH4U5e6xr8'
                },
                body: JSON.stringify({
                    url: longUrl,
                    domain: 'tiny.one'
                })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            const shortenedUrl = data.data.tiny_url;
            setshareurl(shortenedUrl);
            seturlprocess(false);
    
            // Check if the Web Share API is supported
            if (navigator.share) {
                await navigator.share({
                    title: 'Check this out',
                    text: 'Here is a link I want to share with you:',
                    url: shortenedUrl
                });
            } else {
                // Fallback: Alert the user that sharing is not supported
                alert(`Share this link: ${shortenedUrl}`);
            }
        } catch (error) {
            seturlprocess(false);
            console.error('Error shortening URL: ', error);
        }
    };

    useEffect(() =>{
        if(ocrjson && objectfield && triggersubmitproduct){
            onsubmitproduct();
            settriggersubmitproduct(false);
            // console.log(`ran submitproduct`)
        }
    },[objectfield])


    const addfunction = (e) => {
        e.preventDefault();
        const original = { ...objectfield };
        if (addvalue) {
            const newField = { [addvalue]: "" };
            const updatedObject = {...newField,...original};
            setobjectfield(updatedObject);
        }
        setaddvalue("");
    }
    const deletefunction = (mykey) =>{
        if(deletefield){
            const original = {...objectfield};
            delete original[mykey];
            setobjectfield(original);
        }
    }
    const modifyfunction = (e) =>{
        e.preventDefault();
        const original = {...objectfield};
        const newobject = {}
        for(const key in original){
            if(key === originalvalue){
                newobject[modifyvalue] = original[key];
            }else{
                newobject[key] = original[key];
            }
        }
        setobjectfield(newobject);
    }


    const updateinput = async (imgsrc) => {
        try {
            // console.log(`imgsrc : ${imgsrc}`)
            if(imgsrc === "data:,"){
                // console.log(`imgsrc is null`);
                throw new Error("You haven't cropped the image yet")
            }
            const response = await fetch(imgsrc);
            const blob = await response.blob();
            
            const file = new File([blob], 'cropped_image.jpeg', { type: 'image/jpeg' });
            
            const fileList = new DataTransfer();
            fileList.items.add(file);
            
            const myFilesInput = document.getElementById('myFiles');
            myFilesInput.files = fileList.files;
            
            const event = new Event('change', { bubbles: true });
            myFilesInput.dispatchEvent(event);
            setcroperror("");
        } catch (error) {
            // console.error('Error updating input:', error);
            setcroperror(error.message);
        }
    };
    


    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        // console.log(`imageSrc : ${imageSrc}`)
        setCameraEnabled(false);

        const byteCharacters = atob(imageSrc.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // console.log(`bytearray : ${byteArray}`);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        const file = new File([blob], 'captured_image.jpeg', { type: 'image/jpeg' });
        const fileList = new DataTransfer();
        fileList.items.add(file);

        const myFilesInput = document.getElementById('myFiles');
        myFilesInput.files = fileList.files;

        // Manually trigger the change event to call handleFileUpload
        const event = new Event('change', { bubbles: true });
        myFilesInput.dispatchEvent(event);
    };



    const [modalOpen, setModalOpen] = useState(false);
    
    const [productlist, setProductlist] = useState([]);
    const [error2, setError2] = useState("");    
    const { loading } = useContext(Usercontext);
    const fetchUserData = async () => {
        if (auth.currentUser) {
            const userEmail = auth.currentUser.email;
            try {
            const docRef = doc(db, "customTemplate", userEmail);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data());
                setProductlist(docSnap.data());
            } else {
                // console.log("No such document!");
                throw new Error("There is no document");
            }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        }
    };
        const fetchUserData2 = async () => {
            if (auth.currentUser) {
            const userEmail = auth.currentUser.email;
            try {
                const docRef = doc(db, "KEYS", userEmail);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                setproductlist2(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
            }
        };


    useEffect(() => {
        if (!loading) {
            fetchUserData2();
            fetchUserData();
        }
    }, [loading]);

    // useEffect(()=>{
    //     if(productlist2){
    //         console.log(productlist2);
    //     }
    // },[productlist2])


    return (
        <div className="bg-gray-900 font-mono w-full h-full">
            <div className='md:m-auto flex flex-col flex-wrap text-wrap pb-24 pt-[9rem] ' style={{ maxWidth: "1450px" }}>
                <div className="flex justify-center flex-wrap w-auto h-auto">
                    <div className="flex flex-col items-center mt-9">
                        <h1 className="md:text-5xl text-2xl text-white">See Yourself</h1>
                        <h1 className="break-words text-center mt-2 text-white md:text-lg text-sm" style={{ maxWidth: "52rem" }}>Choose from invoices, account & credit card statements, trade register excerpts, payroll statements, identification document and convince yourself.</h1>
                    </div>
                </div>
                {modalOpen && (
                    <Modal
                    updateinput={updateinput}
                    currentimg={imgurl}
                    closeModal={() => setModalOpen(false)}
                    />
                )}
                <div className="flex gap-10 mt-12 flex-wrap justify-center  border-yellow-200">
                    {
                        imgurl ? (
                            
                            <div className="flex flex-col items-center p-4 mt-4">
                                <img className="object-contain h-fit md:max-w-28" src={imgurl} alt="imginput" />
                                <h1 className="text-3xl text-yellow-400 mt-3">{imgname}</h1>
                                <h1 className="text-3xl text-white mt-3 border-2 rounded-md p-2 hover:cursor-pointer" onClick={() => setModalOpen(true)}>CROP IMAGE</h1>
                                {
                                    croperror ? (
                                        <>
                                            <h1 className="text-red-600 text-xl mt-2">{croperror}</h1>
                                        </>
                                    ):(
                                        <></>
                                    )
                                }
                            </div>
                        ) : (
                            <div className="flex justify-center items-center md:max-w-28 overflow-auto text-green-500 bg-gray-300 rounded-lg text-4xl p-4 h-28 mt-9" style={{ whiteSpace: 'pre-wrap' }}>
                                Your file input
                            </div>
                        )
                    }
                    {
                        ocrvalue ? (
                            <div className="md:max-w-28 overflow-auto border-none text-green-500 max-h-34 border-4 whitespace-pre-line p-4 mt-4">
                                {ocrvalue.raw_text || ocrvalue}
                            </div>
                        ) : (
                            processing ? (
                                <>
                                    <div className="flex flex-col items-center md:max-w-28 overflow-auto text-blue-400 text-lg p-4 mt-4 h-28 text-wrap bg-gray-900 gap-0">
                                        <div className="product-loading2">
                                            <div className="mb-2">This could take a while at first time, please wait...</div>
                                            <div className="tiktok-spinner">
                                                <div className="ball red"></div>
                                                <div className="ball blue"></div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                
                            ) : (
                                <div className="flex flex-col justify-center items-center md:max-w-28 overflow-auto text-green-500 rounded-lg text-4xl p-4 h-28 mt-9 bg-gray-300" style={{ whiteSpace: 'pre-wrap' }}>
                                    <div>YOUR RESULT</div>
                                </div>
                                // <div className="md:max-w-28 overflow-auto border-none text-green-500 max-h-34 border-4 whitespace-pre-line p-4 mt-4">
                                //     {formattedText}
                                // </div>
                            )
                        )
                    }
                    <div className="flex flex-col items-center justify-center">
                        <div>
                            {cameraEnabled ? (
                                <div>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                    />
                                    <div className="flex gap-2 my-8">
                                        <button className="text-white border-2 p-2 rounded-xl hover:bg-green-500" onClick={captureImage}>Capture Image</button><br/>
                                        <button className="text-white border-2 p-2 rounded-xl hover:bg-red-500" onClick={() => setCameraEnabled(false)}>Close Camera</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-3 flex flex-col items-center">
                                    <button className="text-white text-wrap p-2 rounded-lg border-2 hover:bg-blue-500" onClick={() => setCameraEnabled(true)}>Access Camera</button>
                                </div>
                            )}
                            <>
                                <label htmlFor="myFiles" className="hover:cursor-pointer border-dashed border-4 border-yellow-400 flex flex-col justify-center items-center w-auto md:p-4 p-10">
                                    <input
                                        type="file"
                                        id="myFiles"
                                        accept="*/*"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    <>
                                        <img className="mt-7 md:max-h-15 md:h-auto h-32" src={img.fileupload} alt="" />
                                        <h1 className="text-3xl text-yellow-400 mt-3">Click here</h1>
                                        <h1 className="text-2xl mt-3 text-white mb-7">PDF, TIFF, JPEG & PNG</h1>
                                    </>
                                </label>
                            </>
                            {/* {capturedImage && <img src={capturedImage} alt="Captured" />} */}
                        </div>
                        <select className="mt-2 p-2 text-md border-none rounded-md hover:cursor-pointer" onChange={(e) => setinputservice(e.target.value)}>
                            <option value="">Select OCR services(Required PAN KEYS)</option>
                            <option value="GG_vision">Google vision (Required JSON file KEYS)</option>
                            <option value="Veryfi">Veryfi (Required Veryfi KEYS) </option>
                            <option value="Viet_OCR">Viet_OCR</option>
                        </select>
                        <button className={!processing ? "text-white mt-4 text-md p-2 rounded-md w-52 bg-yellow-400 hover:bg-yellow-200" : "text-white mt-6 text-md p-2 rounded-md w-52 bg-yellow-500 opacity-50 cursor-not-allowed"} disabled={processing} onClick={sendFiles}> {processing ? "PROCESSING....." : "START OCR"}</button>
                        {
                            error ? (
                                <div className="text-red-700 mt-2 text-xl">{error}</div>
                            ) : null
                        }
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center p-10 flex-wrap border-blue-400 text-white">
                    <div className={switchtype !== "json" ? " bg-gray-800 p-10 flex flex-col items-center gap-4 rounded-lg" : "border-[1px] border-green-500 p-10 flex flex-col items-center gap-4 rounded-lg"}>
                        <h1 className="mb-2 text-3xl text-yellow-400">Config Template for collecting info</h1>
                        <div className="flex">
                            <div className="border-2 p-5 text-center hover:cursor-pointer hover:bg-green-600" onClick={() => setswitchtype("json")}> .JSON </div>
                            <div className="border-2 p-5 text-center hover:cursor-pointer hover:bg-gray-300" onClick={() => setswitchtype("text")}> Text </div>
                        </div>
                        <>
                            {
                                switchtype === "json" && ocrvalue && objectfield ? (
                                    <>
                                        <pre className="text-green-500">
                                            {JSON.stringify(objectfield,null,2)}
                                        </pre>
                                        {/* {
                                            shareurl ? (
                                                <>
                                                    <div className="flex gap-2">
                                                        <h1 className="text-lg text-blue-400 border-[1px] text-center p-2 rounded-xl" >SHARE URL</h1>
                                                        <button className="text-lg border-[1px] p-2 rounded-xl" onClick={copyToClipboard}>COPY</button>
                                                    </div>
                                                    {copySuccess && <span style={{color: "green"}}>Copied!</span>}
                                                </>
                                            ):(
                                                <>
                                                    {
                                                        urlprocess ? (
                                                            <>
                                                                <div>creating url....</div>
                                                            </>
                                                        ):(
                                                            <></>
                                                        )
                                                    }
                                                </>
                                            )
                                        } */}
                                    </>
                                ) : switchtype === "text" && ocrvalue ? (
                                    <div className="text-gray-300 flex flex-col gap-4">
                                        <div className="overflow-auto flex gap-5 justify-center">
                                            <div className="border-2 p-3 rounded-xl hover:cursor-pointer hover:bg-blue-600" onClick={() => {setdeletefield(false);setmodifyfield(false); setshowform(prevshowform => !prevshowform)}}>ADD FIELD</div>
                                            <div className="border-2 p-3 rounded-xl hover:cursor-pointer hover:bg-red-600" onClick={() => {setshowform(false);setmodifyfield(false); setdeletefield(prev => !prev)}}>DELETE FIELD</div>
                                            <div className="border-2 p-3 rounded-xl hover:cursor-pointer hover:bg-yellow-600" onClick={() => {setshowform(false);setdeletefield(false); setmodifyfield(prev => !prev)}}>MODIFY</div>
                                        </div>
                                        <div className="max-w-[35rem] text-wrap text-center text-orange-500">NOTE: Besides English, please use diacritical marks for the most accurate results.</div>
                                        <select className="mt-2 p-2 text-md border-none rounded-md hover:cursor-pointer text-black w-fit text-wrap" onChange={(e) => { e.target.value ? setobjectfield(JSON.parse(productlist[e.target.value].objectfield)) : setobjectfield([])}}>
                                            <option value="">Select your saved template.</option>
                                            {
                                                Object.keys(productlist).map((key) => (
                                                    <>
                                                        <option className="text-wrap" value={key}>{key}</option>
                                                    </>
                                                ))
                                            }
                                        </select>
                                        {
                                            showform ? (
                                                <form className="mb-6 text-blue-600" onSubmit={addfunction}>
                                                    <h1>ADD FIELD</h1>
                                                    <div className="flex">
                                                        <input type="text" value={addvalue} onChange={(e) => setaddvalue(e.target.value)} className="p-2 rounded-lg"/>
                                                        <button type="submit" className="ml-3 border-2 pl-4 pr-4 p-2 rounded-lg flex gap-1 hover:opacity-60 hover:translate-x-1">
                                                            ADD
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                            </svg>

                                                        </button>                                                    
                                                    </div>
                                                </form>
                                            ) : deletefield ? (
                                                <>
                                                    <h1 className=" text-red-600">Choose a field u want to delete (toggle the button to stop) </h1>
                                                </>
                                            ) : modifyfield ? (
                                                <>
                                                    <h1 className=" text-yellow-600">Choose a field u want to modify (toggle the button to stop) </h1>
                                                    {
                                                        modifyfield ? (
                                                            <form className="mb-6 text-yellow-600" onSubmit={modifyfunction}>
                                                                <h1>Modify for {originalvalue}</h1>
                                                                <div className="flex">
                                                                    <input type="text" value={modifyvalue} onChange={(e) => setmodifyvalue(e.target.value)} className="p-2 rounded-lg"/>
                                                                    <button type="submit" className="ml-3 border-2 pl-4 pr-4 p-2 rounded-lg flex gap-1 hover:opacity-60 hover:translate-x-1">
                                                                        CHANGE
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                                        </svg>
                                                                    </button>                                                    
                                                                </div>
                                                            </form>
                                                        ):(
                                                            <>
                                                            </>
                                                        )
                                                    }
                                                </>
                                            ) : (
                                                <></>
                                            )
                                        }
                                        <div className="flex flex-col gap-5">
                                            <div>
                                                {  
                                                    Object.entries(objectfield).map(([key, value]) => (
                                                        <div className="flex flex-col">
                                                            <div className="flex gap-4" key={key}>
                                                                <div className={deletefield ? "hover:cursor-pointer hover:bg-red-600 border-[1px] p-2 w-[20rem] flex items-center overflow-auto": modifyfield ? "hover:cursor-pointer hover:bg-yellow-600 border-[1px] p-2 w-[20rem] flex items-center overflow-auto" : "border-[1px] p-2 w-[20rem] flex items-center overflow-auto"} onClick={() => {deletefunction(key);setmodifyvalue(key);setoriginalvalue(key)}}>
                                                                    {JSON.stringify(key)}
                                                                </div>
                                                                <div className="border-[1px] p-2 w-[30rem] flex items-center overflow-auto">
                                                                    {JSON.stringify(value)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                    // <>
                                                    //     <div>convert to text template</div>
                                                    // </>
                                                }
                                                {/* {
                                                    shareurl ? (
                                                        <>
                                                            <div className="flex gap-2 mt-[1rem] mb-2">
                                                                <h1 className="text-lg text-blue-400 border-[1px] text-center p-2 rounded-xl" >SHARE URL</h1>
                                                                <button className="text-lg border-[1px] p-2 rounded-xl" onClick={copyToClipboard}>COPY</button>
                                                            </div>
                                                            {copySuccess && <span style={{color: "green"}}>Copied!</span>}
                                                        </>
                                                    ):(
                                                        <>
                                                            {
                                                                urlprocess ? (
                                                                    <>
                                                                        <div className="mt-[1rem] mb-[1rem]">creating url....</div>
                                                                    </>
                                                                ):(
                                                                    <></>
                                                                )
                                                            }
                                                        </>
                                                    )
                                                } */}
                                            </div>
                                            {
                                                ocrjson && (
                                                    <>
                                                        <div className="flex gap-3 w-fit h-fit mt-2 mb-2">
                                                            {/* <button onClick={() => handleShare(array[key].ocr_json)} className=" w-fit h-fit cursor-pointer group relative flex gap-1.5 px-8 py-2 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md mt-2">
                                                                Share
                                                            </button>   */}
                                                            <button onClick={() => handleDownload(objectfield)} className=" w-fit h-fit cursor-pointer group relative flex gap-1.5 px-8 py-2 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md mt-2">
                                                                Download
                                                            </button>
                                                            <button onClick={() => handleShare(objectfield)} className=" w-fit h-fit cursor-pointer group relative flex gap-1.5 px-8 py-2 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md mt-2">
                                                                Share
                                                            </button>    
                                                        </div>
                                                    </>
                                                )
                                            }
                                            <button className={collectprocess || selectedFile == undefined ? "p-2 bg-green-600 text-2xl rounded-xl opacity-50 cursor-not-allowed" : "p-2 bg-green-700 hover:bg-green-600 text-2xl rounded-xl"} onClick={convertjson} disabled={collectprocess || selectedFile == undefined}>{collectprocess ? "COLLECTING..." : "COLLECT"}</button>
                                            {
                                                collecterror ? (
                                                    <h1 className="text-red-600 mt-1">{collecterror}</h1>
                                                ) :(
                                                    <></>
                                                )
                                            }
                                        </div>
                                    </div>
                                ) : null
                            }
                        </>
                    </div>
                    <div className="flex justify-center items-center mt-5">
                        <button onClick={clearall} class="cursor-pointer group relative flex gap-1.5 px-8 py-4 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md">
                            Clear all process
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Process;
