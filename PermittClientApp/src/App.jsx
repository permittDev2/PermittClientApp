import { BrowserRouter as Router, NavLink, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SignUpView from '../Components/SignUp/SignUpView'
import LoginView from '../Components/Login/LoginView'
import Landing from '../Components/Landing/LandingView'
import ConfirmEmail from '../Components/ConfirmEmail/ConfirmEmailView'

function App() {
  
  return (
    <Router>
      <div>
        <Routes>
          
        <Route path="/" element={<LoginView />} />
        <Route path="/signup" element={<SignUpView />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
