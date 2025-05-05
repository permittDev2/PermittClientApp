import { BrowserRouter as Router, NavLink, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SignUpView from '../Components/SignUp/SignUpView'
import LoginView from '../Components/Login/LoginView'
import Landing from '../Components/Landing/LandingView'
import ConfirmEmail from '../Components/ConfirmEmail/ConfirmEmailView'
import RequestPasswordReset from '../Components/ResetPassword/RequestPasswordReset'
import ResetPassword from '../Components/ResetPassword/ResetPasswordView'
import SignupSuccessView from '../Components/SignupSuccess/SignupSuccessView'
import ResendConfirmationView from '../Components/ResendConfirmation/ResendConfirmationView'

function App() {
  
  return (
    <Router>
      <div>
        <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/signup" element={<SignUpView />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/forgot-password" element={<RequestPasswordReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup-success" element={<SignupSuccessView />} />
        <Route path="/resend-confirmation" element={<ResendConfirmationView />} />

        </Routes>
      </div>
    </Router>
  )
}

export default App
