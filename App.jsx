import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import Multistepform from "./pages/form";
import AccountPage from "./pages/profile";
import ATSGuide from "./pages/ATSGuide";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
     <Routes>
       <Route path="/" element={<Login />}></Route>
       <Route path="/Registration" element={<Registration />}></Route>
       <Route path="/Dashboard" element={<Dashboard />}></Route>
       <Route path="/Multistepform" element={<Multistepform />}></Route>
       <Route path="/AccountPage" element={<AccountPage />}></Route>
       <Route path="/ATSGuide" element={<ATSGuide />}></Route>
     </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
