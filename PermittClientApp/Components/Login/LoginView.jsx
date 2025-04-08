import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./LoginStyle.css";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const credentials = {
            "email": email,
            "password": password,
        };

        try{
            const response = await fetch('https://localhost:7116/api/Drivers/login',{
             method: 'POST',
             headers: {
                'Content-Type': 'application/json'
             },
             body: JSON.stringify(credentials),
            });

            if(!response.ok) {
                throw new Error ('Login failed');
            }
            
            const data = await response.json();

             // Store the token in localStorage
             localStorage.setItem('token', data.token);

             // Redirect user to another page or update state
             navigate('/profile');

        }   catch(error){
            setError(error.message);
        }
    };

    return (
<div className="login-container">
  <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p>Don't have an account?</p>
      <button className="create-account-btn" onClick={() => navigate('/signup')}>
        Create New Account
      </button>
    </div>
</div>
    );
}

export default Login;