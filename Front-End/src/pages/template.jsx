import { useState, useEffect, useContext } from "react";
import { getDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/firebase-config";
import { Usercontext } from "../App";

function Template() {
  const [productlist, setProductlist] = useState();
  const [error, setError] = useState("");
  const { loading } = useContext(Usercontext);
  const [crud, setCrud] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [currentname,setcurretname] = useState();

  const fetchUserData = async () => {
    if (auth.currentUser) {
      const userEmail = auth.currentUser.email;
      try {
        const docRef = doc(db, "customTemplate", userEmail);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProductlist(docSnap.data());
        } else {
          setError("There is no document");
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

  useEffect(() => {
    if (!loading) {
      fetchUserData();
    }
  }, [loading]);

  const array=[];

  if(productlist){
    for(let key in productlist){
      array.unshift(productlist[key]);
    }
    array.sort((a,b) => new Date(b.date) - new Date(a.date))

  }

  const [showform, setShowForm] = useState(false);
  const [deletefield, setDeleteField] = useState(false);
  const [addvalue, setAddValue] = useState("");
  const [modifyfield, setModifyField] = useState(false);
  const [objectfield, setObjectField] = useState([]);
  const [modifyvalue, setModifyValue] = useState();
  const [originalvalue, setOriginalValue] = useState();
  const [customname, setCustomName] = useState("");

  const [saveprocess, setSaveProcess] = useState(false);
  const [save_error,setsave_error] = useState();

  const getCurrentDateTime = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };


  const saveFunction = async () => {
    try {
      setSaveProcess(true);
      const documentPath = `${auth?.currentUser?.email}`;
      const date = getCurrentDateTime();
      const productDoc = doc(db, "customTemplate", documentPath);
      const newData = { ...productlist };
      
      // Delete the original key
      if(currentname){
        delete newData[currentname];
      }     
      if(Object.entries(objectfield).length <= 0){
        throw new Error("No template found");
      } 
      else if(newData[customname]){
        throw new Error(`"${customname}" already exists`)
      }
      else if(!customname){
        throw new Error("Give a name idiot.");
      }
      // Create the new data object
      newData[customname] = {
        date: date,
        objectfield: JSON.stringify(objectfield),
        name: customname,
      };

      // Update Firestore with the new data
      await setDoc(productDoc, newData);

      setSaveProcess(false);
      setCrud(false);
      setadding(false);
      setsave_error("");
      setCustomName("");
      setcurretname("");
    } catch (error) {
      setSaveProcess(false);
      setsave_error(error.message)
      // console.log(error.message);
    } finally {
      fetchUserData();
    }
  };

  const addFunction = (e) => {
    e.preventDefault();
    const original = { ...objectfield };
    if (addvalue) {
      const newField = { [addvalue]: "" };
      const updatedObject = { ...newField, ...original };
      setObjectField(updatedObject);
    }
    setAddValue("");
  };

  const deletefunction = (mykey) => {
    if (deletefield) {
      const original = { ...objectfield };
      delete original[mykey];
      setObjectField(original);
    }
  };

  const modifyFunction = (e) => {
    e.preventDefault();
    const original = { ...objectfield };
    const newobject = {};
    for (const key in original) {
      if (key === originalvalue) {
        newobject[modifyvalue] = original[key];
      } else {
        newobject[key] = original[key];
      }
    }
    setObjectField(newobject);
  };

  const [deleteprocess,setdeleteprocess] = useState(false);
  
  const [confirm,setconfirm] = useState(false);
  const [currentkey,setcurrentkey] = useState();

  const handledelete = async(date) =>{
    const userEmail = auth.currentUser.email;
    const docRef =doc(db,"customTemplate",userEmail);
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
        setconfirm(false);
      }
    } catch (err) {
      setdeleteprocess(false)
      // console.error("Error deleting checked items:", err);
    }finally{
      await fetchUserData();
      setdeleteprocess(false)
    }

  }

  const [adding,setadding] = useState(false);
  return (
    <>
      <div className="pt-[16rem] p-[4rem] min-h-screen font-mono bg-gray-700">
          <>
            <table className="w-full m-auto bg-gray-800 border-none rounded-3xl">
              <thead className="">
                <tr>
                  <th className="border-gray-300 p-9 text-blue-500 text-3xl">
                    NAME
                  </th>
                  <th className="border-gray-300 p-9 text-white text-3xl">
                    TEMPLATE
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(array).map((key) => (
                  <>
                    <tr key={key}>
                      <td className="border-gray-300 text-blue-500 text-xl">
                        <div className="flex flex-col items-center justify-center text-wrap gap-2">
                          <span>{array[key].name}</span>
                          {crud && activeKey === key ? (
                            <>
                              <input className="p-2 text-wrap text-center text-base" type="text" value={customname} onChange={(e)=> setCustomName(e.target.value)} />
                            </>
                          ):(
                            <></>
                          )}
                        </div>
                      </td>
                      {crud && activeKey === key ? (
                        <>
                          <td className="border-gray-300 pb-9 pt-9 text-blue-500">
                            <div className="text-gray-300 flex flex-col gap-4">
                              <div className="overflow-auto flex gap-5 justify-center">
                                <div className="border-2 p-3 rounded-lg hover:cursor-pointer hover:bg-blue-600 text-base" onClick={() => { setDeleteField(false);setModifyField(false);setShowForm((prevShowForm) => !prevShowForm);}}>
                                  ADD FIELD
                                </div>
                                <div className="border-2 p-3 rounded-lg hover:cursor-pointer hover:bg-red-600 text-base" onClick={() => {setShowForm(false);setModifyField(false);setDeleteField((prev) => !prev);}}
                                >
                                  DELETE FIELD
                                </div>
                                <div className="border-2 p-3 rounded-lg hover:cursor-pointer hover:bg-yellow-600 text-base" onClick={() => {setShowForm(false);setDeleteField(false);setModifyField((prev) => !prev); }}
                                >
                                  MODIFY
                                </div>
                              </div>
                              <div className="flex flex-col items-center text-base">
                                {showform ? (
                                  <form
                                    className="mb-6 text-blue-600"
                                    onSubmit={addFunction}
                                  >
                                    <h1>ADD FIELD</h1>
                                    <div className="flex">
                                      <input
                                        type="text"
                                        value={addvalue}
                                        onChange={(e) =>
                                          setAddValue(e.target.value)
                                        }
                                        className="p-2 rounded-lg"
                                      />
                                      <button
                                        type="submit"
                                        className="ml-3 border-2 pl-4 pr-4 p-2 rounded-lg flex gap-1 hover:opacity-60 hover:translate-x-1"
                                      >
                                        ADD
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth="1.5"
                                          stroke="currentColor"
                                          className="w-6 h-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </form>
                                ) : deletefield ? (
                                  <>
                                    <h1 className=" text-red-600">
                                      Choose a field you want to delete (toggle the
                                      button to stop)
                                    </h1>
                                  </>
                                ) : modifyfield ? (
                                  <>
                                    <h1 className=" text-yellow-600">
                                      Choose a field you want to modify (toggle the
                                      button to stop)
                                    </h1>
                                    {modifyfield ? (
                                      <form
                                        className="mb-6 text-yellow-600"
                                        onSubmit={modifyFunction}
                                      >
                                        <h1>Modify for {originalvalue}</h1>
                                        <div className="flex">
                                          <input
                                            type="text"
                                            value={modifyvalue}
                                            onChange={(e) =>
                                              setModifyValue(e.target.value)
                                            }
                                            className="p-2 rounded-lg"
                                          />
                                          <button
                                            type="submit"
                                            className="ml-3 border-2 pl-4 pr-4 p-2 rounded-lg flex gap-1 hover:opacity-60 hover:translate-x-1"
                                          >
                                            CHANGE
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              strokeWidth="1.5"
                                              stroke="currentColor"
                                              className="w-6 h-6"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <></>
                                    )}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </div>
                              <div className="flex flex-col gap-5 items-center">
                                <div className="min-w-[25rem]">
                                  {Object.entries(objectfield).map(
                                    ([key, value]) => (
                                      <div className="flex flex-col" key={key}>
                                        <div className="flex gap-4 text-base text-wrap">
                                          <div
                                            className={
                                              deletefield
                                                ? "hover:cursor-pointer hover:bg-red-600 border-[1px] p-2 w-full flex items-center"
                                                : modifyfield
                                                ? "hover:cursor-pointer hover:bg-yellow-600 border-[1px] p-2 w-full flex items-center"
                                                : "border-[1px] p-2 w-full flex items-center"
                                            }
                                            onClick={() => {
                                              deletefunction(key);
                                              setModifyValue(key);
                                              setOriginalValue(key);
                                            }}
                                          >
                                            {key}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="border-gray-300 pr-9 text-white text-xl">
                            <div className="flex flex-col items-center">
                              <div
                                className="rounded-lg hover:cursor-pointer bg-green-700 hover:bg-blue-600 text-base text-center px-8 py-2"
                                disabled={saveprocess}
                                onClick={saveFunction}
                                >
                                {saveprocess ? "Saving..." : "Save"}
                              </div>
                              <div className="rounded-lg hover:cursor-pointer bg-red-700 hover:bg-red-600 text-base text-center mt-3 px-8 py-2"
                                onClick={() => {setCrud(false);setsave_error("");setCustomName("");setcurretname("")}}
                              >
                                Cancel
                              </div>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border-gray-300 pt-9 pb-9 text-white text-xl">
                            <div className="flex items-center justify-center text-wrap gap-7 flex-wrap">
                              <pre className="text-green-500 text-wrap">
                                {JSON.stringify(
                                  JSON.parse(array[key].objectfield),
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          </td>
                          <td className="border-gray-300  pr-9 text-white text-xl">
                            <div className="flex flex-col items-center">
                              <div
                                className="border-[1px] px-8 py-2 rounded-lg hover:cursor-pointer hover:bg-blue-600 text-base text-center"
                                onClick={() => {
                                  setCrud(true);
                                  setadding(false);
                                  setcurretname(array[key].name)
                                  setCustomName(array[key].name)
                                  setObjectField(
                                    JSON.parse(array[key].objectfield)
                                  );
                                  setActiveKey(key);
                                }}>
                                EDIT
                              </div>
                              <button onClick={() => {setconfirm((prev) => !prev);setcurrentkey(key)}} className="cursor-pointer group relative flex gap-1.5 px-8 py-2 bg-red-700 hover:bg-red-600 bg-opacity-80 text-[#f1f1f1] rounded-lg hover:bg-opacity-70 transition font-semibold shadow-md mt-5 text-base">
                                  {confirm && key == currentkey ? "Cancel" : "Delete"}
                              </button> 
                              {
                                confirm && key == currentkey ? (
                                  <>
                                    <button disabled={deleteprocess} onClick={() => handledelete(array[key].date)} className="cursor-pointer group relative flex gap-1.5 px-8 py-2 bg-green-700 hover:bg-green-600 bg-opacity-80 text-[#f1f1f1] rounded-lg hover:bg-opacity-70 transition font-semibold shadow-md mt-4 text-base">
                                      {deleteprocess? "Deleting..." : "Confirm"}
                                    </button>                     
                                  </>
                                ) :(
                                  <></>
                                )
                              }
                            </div>
                          </td>
                        </>
                      )}
                    </tr>                
                  </>
                ))}
                <tr>  
                  <td className="border-gray-300 text-blue-500 text-xl pb-9 pt-9">
                    <div className="flex flex-col items-center justify-center text-wrap">
                      <>
                        <input className="p-3 text-wrap text-base rounded-lg text-center" type="text" value={ customname && adding ? customname : ""} onChange={(e)=> setCustomName(e.target.value)} />
                      </>
                    </div>
                  </td>
                  { adding ? (
                    <>
                      <td className="border-gray-300 pb-9 pt-9 text-blue-500">
                        <div className="text-gray-300 flex flex-col gap-4">
                          <div className="overflow-auto flex gap-5 justify-center">
                            <div
                              className="border-2 p-3 rounded-lg hover:cursor-pointer hover:bg-blue-600 text-base"
                              onClick={() => {
                                setDeleteField(false);
                                setModifyField(false);
                                setShowForm((prevShowForm) => !prevShowForm);
                              }}
                            >
                              ADD FIELD
                            </div>
                            <div
                              className="border-2 p-3 rounded-lg hover:cursor-pointer hover:bg-red-600 text-base"
                              onClick={() => {
                                setShowForm(false);
                                setModifyField(false);
                                setDeleteField((prev) => !prev);
                              }}
                            >
                              DELETE FIELD
                            </div>
                            <div
                              className="border-2 p-3 rounded-lg hover:cursor-pointer hover:bg-yellow-600 text-base"
                              onClick={() => {
                                setShowForm(false);
                                setDeleteField(false);
                                setModifyField((prev) => !prev);
                              }}
                            >
                              MODIFY
                            </div>
                          </div>
                          {
                            save_error ? (
                              <>
                                <div className="text-red-600 text-center text-lg">{save_error}</div>
                              </>
                            ) : (
                              <></>
                            )
                          }
                          <div className="flex flex-col items-center text-base">
                            {showform ? (
                              <form
                                className="mb-6 text-blue-600"
                                onSubmit={addFunction}
                              >
                                <h1>ADD FIELD</h1>
                                <div className="flex">
                                  <input
                                    type="text"
                                    value={addvalue}
                                    onChange={(e) =>
                                      setAddValue(e.target.value)
                                    }
                                    className="p-2 rounded-lg"
                                  />
                                  <button
                                    type="submit"
                                    className="ml-3 border-2 pl-4 pr-4 p-2 rounded-lg flex gap-1 hover:opacity-60 hover:translate-x-1"
                                  >
                                    ADD
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                      className="w-6 h-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </form>
                            ) : deletefield ? (
                              <>
                                <h1 className=" text-red-600">
                                  Choose a field you want to delete (toggle the
                                  button to stop)
                                </h1>
                              </>
                            ) : modifyfield ? (
                              <>
                                <h1 className=" text-yellow-600">
                                  Choose a field you want to modify (toggle the
                                  button to stop)
                                </h1>
                                {modifyfield ? (
                                  <form
                                    className="mb-6 text-yellow-600"
                                    onSubmit={modifyFunction}
                                  >
                                    <h1>Modify for {originalvalue}</h1>
                                    <div className="flex">
                                      <input
                                        type="text"
                                        value={modifyvalue}
                                        onChange={(e) =>
                                          setModifyValue(e.target.value)
                                        }
                                        className="p-2 rounded-lg"
                                      />
                                      <button
                                        type="submit"
                                        className="ml-3 border-2 pl-4 pr-4 p-2 rounded-lg flex gap-1 hover:opacity-60 hover:translate-x-1"
                                      >
                                        CHANGE
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth="1.5"
                                          stroke="currentColor"
                                          className="w-6 h-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </form>
                                ) : (
                                  <></>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className="flex flex-col gap-5 items-center">
                            <div className="min-w-[25rem]">
                              {Object.entries(objectfield).map(
                                ([key, value]) => (
                                  <div className="flex flex-col" key={key}>
                                    <div className="flex gap-4 text-base text-wrap">
                                      <div
                                        className={
                                          deletefield
                                            ? "hover:cursor-pointer hover:bg-red-600 border-[1px] p-2 w-full flex items-center"
                                            : modifyfield
                                            ? "hover:cursor-pointer hover:bg-yellow-600 border-[1px] p-2 w-full flex items-center"
                                            : "border-[1px] p-2 w-full flex items-center"
                                        }
                                        onClick={() => {
                                          deletefunction(key);
                                          setModifyValue(key);
                                          setOriginalValue(key);
                                        }}
                                      >
                                        {key}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="border-gray-300 pr-9 text-white text-base pt-9 pb-9">
                        <div className="flex flex-col items-center">
                          <div
                            className="px-8 py-2 rounded-lg hover:cursor-pointer bg-green-700 hover:bg-blue-600 text-base text-center"
                            disabled={saveprocess}
                            onClick={()=>{saveFunction()}}
                            >
                            {saveprocess ? "ADDING..." : "ADD"}
                          </div>
                          <div className="px-8 py-2 rounded-lg hover:cursor-pointer bg-red-700 hover:bg-red-600 text-base text-center mt-3"
                            onClick={() => {setadding(false)}}
                          >
                            Cancel
                          </div>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border-gray-300 pt-9 pb-9 text-white text-base">

                      </td>
                      <td className="border-gray-300  pr-9 text-white text-xl pt-9 pb-9">
                        <div className="flex flex-col items-center">
                          <div
                            className="border-[1px] px-8 py-2 rounded-lg hover:cursor-pointer hover:bg-blue-600 text-base text-center"
                            onClick={() => {
                              setcurretname("");
                              setCustomName("");
                              setadding(true);
                              setCrud(false);
                              setObjectField([]);
                              setShowForm(false);
                              setModifyField(false);
                              setDeleteField(false);
                              setAddValue("");
                              setModifyValue("");
                              setOriginalValue("");
                            }}>
                            Create
                          </div>
                        </div>
                      </td>
                    </>
                  )}
                </tr>  
              </tbody>
            </table>
          </>
      </div>
    </>
  );
}

export default Template;
