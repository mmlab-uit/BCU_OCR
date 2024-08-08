import { useState, useEffect, useContext } from "react";
import { getDoc, doc,deleteDoc,setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/firebase-config";
import { Usercontext } from "../App";

function History() {
  const [productlist, setProductlist] = useState([]);
  const [error, setError] = useState("");
  const { loading } = useContext(Usercontext);

  const fetchUserData = async () => {
    if (auth.currentUser) {
      const userEmail = auth.currentUser.email;
      try {
        const docRef = doc(db, "history", userEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());
          setProductlist(docSnap.data());
        } else {
          // console.log("No such document!");
          throw new Error("There is no document");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching document:", error);
      }
    } else {
      console.error("User is not authenticated");
      setError("User is not authenticated");
    }
  };



    // const copyToClipboard = async () => {
    //     try {
    //         await navigator.clipboard.writeText(shareurl);
    //         setCopySuccess(true);
    //     } catch (err) {
    //         console.error('Failed to copy: ', err);
    //     }
    // };

  const [shareurl,setshareurl] = useState("");
  const [urlprocess,seturlprocess]= useState(false);
  // const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async (objectfield) => {
    const jsonString = objectfield;
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


    const handleDownload = (objectfield) => {
      // Convert object to JSON string with pretty-print (2 spaces for indentation)
      const temp = JSON.parse(objectfield)
      const jsonString = JSON.stringify(temp,null,2);
      
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
  
  const array=[];

  if(productlist){
    for(let key in productlist){
      array.unshift(productlist[key]);
    }
    array.sort((a,b) => new Date(b.date) - new Date(a.date))

  }
  const [checkedItems, setCheckedItems] = useState({});
  const [checkederror,setcheckederror] = useState();
  const [deleteprocess,setdeleteprocess] = useState(false);


  const handleDeleteChecked = async () => {
    const userEmail = auth.currentUser.email;
    const docRef = doc(db, "history", userEmail);
  
    try {
      setdeleteprocess(true);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const newData = { ...data };
        Object.keys(checkedItems).forEach((key) => {
          if (checkedItems[key]) {
            delete newData[key];
          }
        });
        await setDoc(docRef, newData);
        // console.log("Checked items deleted successfully.");
        setCheckedItems({});
        setcheckederror("");
      }
      if(Object.entries(checkedItems).length <= 0){
        throw new Error("You haven't checked any item yet.")
      }
    } catch (err) {
      setdeleteprocess(false)
      // console.error("Error deleting checked items:", err);
      setcheckederror(err.message);
    }finally{
      await fetchUserData();
      setdeleteprocess(false)
    }
  };

  const handledelete = async(date) =>{
    const userEmail = auth.currentUser.email;
    const docRef =doc(db,"history",userEmail);
    try {
      setdeleteprocess(true);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const newData = { ...data };
        Object.keys(newData).forEach((key) => {
          if (newData[key].date == date) {
            delete newData[key];
          }
        });
        await setDoc(docRef, newData);
        // console.log("Checked items deleted successfully.");
        setcheckederror("");
        setconfirm(false);
      }
    } catch (err) {
      setdeleteprocess(false)
      // console.error("Error deleting checked items:", err);
      setcheckederror(err.message);
    }finally{
      await fetchUserData();
      setdeleteprocess(false)
    }

  }


  useEffect(() => {
    if (!loading) {
      fetchUserData();
    }
  }, [loading]);

  const handleCheckboxChange = (key, isChecked) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [key]: isChecked,
    }));

  };

  const handleMasterCheckboxChange = (isChecked) => {
    const newCheckedItems = {};
    for (let key in productlist) {
      newCheckedItems[productlist[key].date] = isChecked;
    }
    setCheckedItems(newCheckedItems);
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  };

  const [confirm,setconfirm] = useState(false);
  const [currentkey,setcurrentkey] = useState();



  return (
    <div className="pt-[16rem] p-[4rem] min-h-screen font-mono bg-gray-700">
      {array.length <= 0 ? (
          <div className="text-red-500 text-center text-4xl">There is no document</div>
        ): (
          <>
            {array && (
              <div className="bg-gray-800 border-none rounded-3xl">
                <div className="flex justify-center p-7 gap-6 flex-wrap items-center w-full mt-[1rem]">
                  <div className="flex flex-col items-center">
                    <button className="p-4 rounded-xl text-white bg-red-900" disabled={deleteprocess} onClick={handleDeleteChecked}>{deleteprocess? "Deleting..." : "Delete Checked Items"}</button>
                    {
                      checkederror ? (
                        <>
                          <div className="text-red-700 text-lg mt-2">{checkederror}</div>
                        </>
                      ):(
                        <></>
                      )
                    }
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <input className="size-8"
                      type="checkbox"
                      onChange={(e) => handleMasterCheckboxChange(e.target.checked)}
                    />
                    <div className="">Select All</div>
                  </div>
                </div>
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="border-gray-300 p-9 text-blue-500 text-3xl">Time</th>
                      <th className="border-gray-300 p-9 text-white text-3xl">OCR Picture</th>
                      <th className="border-gray-300 p-9 text-green-500 text-3xl">OCR JSON</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(array).map((key) => (
                      <tr key={array[key].date}>
                        <td className="border-gray-300 p-7 text-blue-500 text-xl">
                          <div className="flex items-center">
                            <input className="mr-5 size-8" type="checkbox" onChange={(e) => handleCheckboxChange(array[key].date, e.target.checked)} />
                            <span className="">{array[key].date}</span>
                          </div>
                        </td>
                        <td className="border-gray-300 p-7 flex justify-center items-center">
                          <img className="w-[20rem]" src={array[key].ocr_picture} alt="" />
                        </td>
                        <td className="border-gray-300 pt-7 pb-7">
                          <div className="flex flex-col items-center">
                            <pre className="text-green-500 text-wrap">
                            {JSON.stringify(JSON.parse(array[key].ocr_json), null, 2)}
                            </pre>
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
                            <div className="flex gap-3 w-fit h-fit mt-2">
                              <button onClick={() => handleShare(array[key].ocr_json)} className=" w-fit h-fit cursor-pointer group relative flex gap-1.5 px-8 py-2 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md mt-2">
                                Share
                              </button>  
                              <button onClick={() => handleDownload(array[key].ocr_json)} className=" w-fit h-fit cursor-pointer group relative flex gap-1.5 px-8 py-2 bg-black bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md mt-2">
                                Download
                              </button>  
                              <div className="flex flex-col gap-4">
                                <button onClick={() => {setconfirm((prev) => !prev);setcurrentkey(key)}} className="cursor-pointer group relative flex gap-1.5 px-8 py-2 bg-red-700 hover:bg-red-600 bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md mt-2">
                                  {confirm && key == currentkey ? "Cancel" : "Delete"}
                                </button> 
                                {
                                  confirm && key == currentkey ? (
                                    <>
                                      <button disabled={deleteprocess} onClick={() => handledelete(array[key].date)} className="cursor-pointer group relative flex gap-1.5 px-8 py-2 bg-green-700 hover:bg-green-600 bg-opacity-80 text-[#f1f1f1] rounded-3xl hover:bg-opacity-70 transition font-semibold shadow-md mt-2">
                                        {deleteprocess? "Deleting..." : "Confirm"}
                                      </button>                     
                                    </>
                                  ) :(
                                    <></>
                                  )
                                }
                              </div> 
                            </div>
                          </div>
                        </td>        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}       
          </>
        )
      }
    </div>
  );
}

export default History;
