import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp.jsx"
import About from "./pages/About"
import Profile from "./pages/Profile.jsx"
import Header from "./components/Header.jsx"
import PrivateRoute from "./components/PrivateRoute.jsx"


export default function App() {
  return (

    // <div className="bg-gray-400">
    <BrowserRouter>
    <Header />

  <Routes>
    <Route path ="/" element={< Home/>} />
    <Route path ="/sign-in" element={< SignIn/>} />
    <Route path ="/sign-up" element={< SignUp/>} />
    <Route path ="/about" element={< About/>} />
    <Route element={<PrivateRoute/>}>
    <Route path ="/profile" element={< Profile />} />
    </Route>
  </Routes>
  
    </BrowserRouter>
    
  )
}
