import { BrowserRouter as Router, NavLink, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SignUpView from '../Components/SignUp/SignUpView'
import Login from '../Components/Login/LoginView'

function App() {
  
  return (
    <Router>
      <div>
        <Routes>
          
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUpView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
