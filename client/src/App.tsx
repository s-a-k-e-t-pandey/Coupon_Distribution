import AdminDash from "./component/AdminDash"
import Landingpage from "./component/LandingPage"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from "./component/LoginPage";

export default function App() {
  const token = localStorage.getItem('token');
  
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Landingpage/>}/>
      <Route path="/admin" element={<AdminDash/>}/>
      <Route path="/login" element={<AdminLogin/>}/>
    </Routes>
  </Router>
  )
}