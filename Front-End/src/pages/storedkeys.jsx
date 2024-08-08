import { useState, useContext, useEffect } from "react";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { auth, db } from "../Firebase/firebase-config";
import { Usercontext } from "../App";

const storage = getStorage();

function StoredKeys() {
    const [key, setKey] = useState("");
    const { loading } = useContext(Usercontext);
    const [loadingkey, setloadingkey] = useState(false);
    const [saveProcess, setSaveProcess] = useState(false);
    const [error, setError] = useState(null);
    const [productlist2, setproductlist2] = useState();
    const [Filename, setFilename] = useState("");
    const [saved, setsaved] = useState(false);

    const [id, setid] = useState("");
    const [secret, setsecret] = useState("");
    const [username, setusername] = useState("");
    const [veryfikey, setveryfikey] = useState("");
    const [saveprocess2, setsaveprocess2] = useState(false);
    const [jsonfile, setjsonfile] = useState("");

    const [showKey, setShowKey] = useState(false);
    const [showId, setShowId] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [showVeryfiKey, setShowVeryfiKey] = useState(false);

    useEffect(() => {
        if (!loading) {
            fetchUserData2();
        }
    }, [loading]);

    useEffect(() => {
        if (productlist2) {
            setKey(productlist2.PAN_key);
            setid(productlist2.Client_id);
            setsecret(productlist2.Client_secret);
            setusername(productlist2.Username);
            setveryfikey(productlist2.Veryfikey);
            setFilename(productlist2.filename)
        }
    }, [productlist2]);

    const generateapikey = async () => {
        try {
            setSaveProcess(true);
            setError(null);
            const response = await fetch("https://fastapi-r12h.onrender.com/generate-api-key", {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
            });
            const json = await response.json();
            setKey(json.api_key);
            setSaveProcess(false);
        } catch (err) {
            setError(err.message);
            setSaveProcess(false);
        }
    };

    const fetchUserData2 = async () => {
        if (auth.currentUser) {
            const userEmail = auth.currentUser.email;
            try {
                setloadingkey(true);
                const docRef = doc(db, "KEYS", userEmail);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setproductlist2(docSnap.data());
                }
                setloadingkey(false);
            } catch (error) {
                setloadingkey(false);
                console.error("Error fetching document:", error);
            }
        }
    };

    const saveFunction = async () => {
        try {
            setsaveprocess2(true);
            setError(null); // Clear previous errors

            const documentPath = `${auth?.currentUser?.email}`;
            const productDoc = doc(db, "KEYS", documentPath);
            const data = {
                PAN_key: key ? key : productlist2 ? productlist2.PAN_key : "",
                Client_id: id ? id : productlist2 ? productlist2.Client_id : "",
                Client_secret: secret ? secret : productlist2 ? productlist2.Client_secret : "",

                Username: username ? username : productlist2 ? productlist2.Username : "",

                Veryfikey: veryfikey ? veryfikey : productlist2 ? productlist2.Veryfikey : "",

                type: jsonfile.type ? jsonfile.type : productlist2 ? productlist2.type : "",

                project_id: jsonfile.project_id ? jsonfile.project_id : productlist2 ? productlist2.project_id : "",

                private_key_id: jsonfile.private_key_id ? jsonfile.private_key_id : productlist2 ? productlist2.private_key_id : "",

                private_key: jsonfile.private_key ? jsonfile.private_key : productlist2 ? productlist2.private_key : "",

                client_email: jsonfile.client_email ? jsonfile.client_email : productlist2 ? productlist2.client_email : "",

                client_id: jsonfile.client_id ? jsonfile.client_id : productlist2 ? productlist2.client_id : "",

                auth_uri: jsonfile.auth_uri ? jsonfile.auth_uri : productlist2 ? productlist2.auth_uri : "",

                token_uri: jsonfile.token_uri ? jsonfile.token_uri : productlist2 ? productlist2.token_uri : "",

                auth_provider_x509_cert_url: jsonfile.auth_provider_x509_cert_url ? jsonfile.auth_provider_x509_cert_url : productlist2 ? productlist2.auth_provider_x509_cert_url : "",

                client_x509_cert_url: jsonfile.client_x509_cert_url ? jsonfile.client_x509_cert_url : productlist2 ? productlist2.client_x509_cert_url : "",

                universe_domain: jsonfile.universe_domain ? jsonfile.universe_domain : productlist2 ? productlist2.universe_domain : "",

                filename: jsonfile.filename ? jsonfile.filename : productlist2 ? productlist2.filename : "",

            };

            await setDoc(productDoc, data, { merge: true });
            setsaveprocess2(false);
            setError("");
            setsaved(true);
        } catch (error) {
            setsaveprocess2(false);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (saved) {
            const timeout = setTimeout(() => {
                setsaved(false);
            }, 2500);

            return () => clearTimeout(timeout);
        }
    }, [saved]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            try {
                const parsedJson = JSON.parse(content);
                parsedJson.filename = file.name;
                setjsonfile(parsedJson);
                setError(null); // Clear previous errors
            } catch (error) {
                setError("Invalid JSON format. Please provide a valid JSON file.");
                setjsonfile(null);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="pt-[14rem] bg-gray-800 pb-[14rem] font-mono">
            <div className="flex justify-center">
                <form
                    className="rounded-xl flex flex-col gap-9 text-white lg:min-w-[1000px] w-fit"
                    onSubmit={(e) => {
                        e.preventDefault();
                        saveFunction();
                    }}
                >
                    <div>
                        <div className="text-xl font-bold">PAN api key</div>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                <input
                                    className="rounded-xl mt-1 text-xl text-green-400 p-2 w-full"
                                    type={showKey ? "text" : "password"}
                                    required
                                    value={loadingkey ? "Getting key..." : key ? key : "You have no key!"}
                                    disabled={true}
                                />
                                <button
                                    type="button"
                                    className="bg-gray-600 text-white p-2 rounded"
                                    onClick={() => setShowKey(!showKey)}
                                >
                                    {showKey ? "Hide" : "Show"}
                                </button>
                            </div>
                            <button
                                className={`rounded-xl p-2 whitespace-nowrap text-lg w-fit self-center ${saveProcess ? 'bg-green-700 opacity-65' : error === "User is not authenticated" ? 'cursor-not-allowed bg-green-600 opacity-55' : 'hover:bg-green-700 bg-green-600'}`}
                                disabled={saveProcess || error === "User is not authenticated" || saveprocess2 || loadingkey}
                                onClick={() => generateapikey()}
                            >
                                {saveProcess ? "Generating" : "Generate new key"}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 rounded-xl p-3 py-9 bg-gray-900">
                        <div className="text-center text-xl">Veryfi KEYS</div>
                        <div>
                            <div className="text-xl font-bold">Client_id</div>
                            <div className="flex gap-3">
                                <input
                                    className="rounded-xl mt-1 text-xl text-green-400 p-2 w-full bg-gray-600"
                                    type={showId ? "text" : "password"}
                                    value={loadingkey ? "Getting key..." : id}
                                    onChange={(e) => setid(e.target.value)}
                                    disabled={loadingkey}
                                />
                                <button
                                    type="button"
                                    className="bg-gray-600 text-white p-2 rounded"
                                    onClick={() => setShowId(!showId)}
                                >
                                    {showId ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="text-xl font-bold">Client_secret</div>
                            <div className="flex gap-3">
                                <input
                                    className="rounded-xl mt-1 text-xl text-green-400 p-2 w-full bg-gray-600"
                                    type={showSecret ? "text" : "password"}
                                    value={loadingkey ? "Getting key..." : secret}
                                    onChange={(e) => setsecret(e.target.value)}
                                    disabled={loadingkey}
                                />
                                <button
                                    type="button"
                                    className="bg-gray-600 text-white p-2 rounded"
                                    onClick={() => setShowSecret(!showSecret)}
                                >
                                    {showSecret ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="text-xl font-bold">Username</div>
                            <div className="flex gap-3">
                                <input
                                    className="rounded-xl mt-1 text-xl text-green-400 p-2 w-full bg-gray-600"
                                    type={"text"}
                                    value={loadingkey ? "Getting key..." : username}
                                    onChange={(e) => setusername(e.target.value)}
                                    disabled={loadingkey}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="text-xl font-bold">Api_key</div>
                            <div className="flex gap-3">
                                <input
                                    className="rounded-xl mt-1 text-xl text-green-400 p-2 w-full bg-gray-600"
                                    type={showVeryfiKey ? "text" : "password"}
                                    value={loadingkey ? "Getting key..." : veryfikey}
                                    onChange={(e) => setveryfikey(e.target.value)}
                                    disabled={loadingkey}
                                />
                                <button
                                    type="button"
                                    className="bg-gray-600 text-white p-2 rounded"
                                    onClick={() => setShowVeryfiKey(!showVeryfiKey)}
                                >
                                    {showVeryfiKey ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 rounded-xl p-3 py-9 bg-gray-900">
                        <div className="text-center text-xl">Google Vision KEYS</div>
                        <div className="text-red-500">*ONLY ACCEPT JSON FILE*</div>
                        <input
                            type="file"
                            accept="application/json"
                            onChange={handleFileChange}
                        />
                        {
                            Filename && (
                                <>
                                    <div className="text-blue-500 text-lg">WE HAVE RECEIVED YOUR FILE : {Filename}</div>
                                </>
                            )
                        }
                    </div>
                    <button
                        className={`rounded-xl p-2 whitespace-nowrap text-lg ${saveprocess2 ? 'bg-green-700 opacity-65' : error === "User is not authenticated" ? 'cursor-not-allowed bg-green-600 opacity-55' : 'hover:bg-green-700 bg-green-600'}`}
                        type="submit"
                        disabled={saveprocess2 || error === "User is not authenticated" || saveProcess || loadingkey}
                    >
                        {saveprocess2 ? "Saving" : "Save"}
                    </button>
                    {saved && <div className="text-blue-500 text-center text-2xl">SAVED!</div>}
                    {error && <div className="text-red-500 text-center text-xl">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default StoredKeys;
