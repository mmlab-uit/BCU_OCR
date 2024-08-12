import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import {createContext, Suspense,useState,useEffect} from "react"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './Firebase/firebase-config.js';



import { Header } from './Components/header';
import {Mainpage} from './pages/mainpage';
import { Footer } from './Components/footer.jsx';
import { lazy } from 'react';
import Integration from './pages/integration.jsx';
import SharedJson from './pages/share.jsx';
import Process from "./pages/process.jsx";
import Login from "./pages/login.jsx";
import Sign from "./pages/signup.jsx"

// const Solution = lazy(() => import("./pages/solution.jsx"));

const History = lazy(()=> import("./pages/history.jsx"));
const Template = lazy(() =>import("./pages/template.jsx"));
// const About = lazy(() => import("./pages/about.jsx"));

const Policy = lazy (() => import("./pages/policy.jsx"));
const About = lazy(() => import("./pages/about.jsx"));
const Storedkeys = lazy(()=> import("./pages/storedkeys.jsx"))

export const Usercontext = createContext("");


function App() {
  const [imgurl, setImgUrl] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

 

  const initializeUser = (user) => {
    if (user) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
    setLoading(false);
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  const LoadingIndicator = () => (
    <div className="product-loading">
      <div className="tiktok-spinner">
        <div className="ball red"></div>
        <div className="ball blue"></div>
      </div>
    </div>
  );
  
  const keepFunctionWarm = async () => {
      await fetch('https://fastapi-r12h.onrender.com');
  };

  // Call this function when your app starts
  useEffect(() => {
    if(loading==false){
      keepFunctionWarm();
    }
  },[])

  if (loading) {
    return <LoadingIndicator />;
  }


  return (
    <>
      <Usercontext.Provider value={{imgurl,setImgUrl,userLoggedIn,loading,setLoading}}>
        <BrowserRouter>
          <Header/>
          <Routes>
            <Route path="/history" element={<Suspense fallback={<LoadingIndicator />}><History/></Suspense>} />
            <Route path="/template" element={<Suspense fallback={<LoadingIndicator />}><Template/></Suspense>} />
            <Route path="/privacy-policy" element={<Suspense fallback={<LoadingIndicator />}><Policy/></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<LoadingIndicator />}><About/></Suspense>} />
            <Route path="/storedkey" element={<Suspense fallback={<LoadingIndicator />}><Storedkeys/></Suspense>} />
            {/* <Route path="/about" element={<Suspense fallback={<LoadingIndicator />}><About/></Suspense>} /> */}
            <Route path='/' element={ <Mainpage/> } />
            <Route path="/process" element={<Suspense fallback={<LoadingIndicator />}><Process/></Suspense>} />
            <Route path='/sign' element={ <Sign/> } />         
            <Route path='/login' element={ <Login/> } />         
            <Route path="/integration" element={ <Integration/>} />
            <Route path='/share' element={ <SharedJson/> } />
          </Routes>
          <Footer/>
        </BrowserRouter>
      </Usercontext.Provider>
    </>
  );
}

export default App;
