import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import "./LoginStyle.css";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const credentials = {
            "email": email,
            "password": password,
        };

        try{
            const response = await fetch('https://localhost:7151/api/Account/login',{
             method: 'POST',
             headers: {
                'Content-Type': 'application/json'
             },
             body: JSON.stringify(credentials),
            });

            if(!response.ok) {
              const errorData = await response.json(); // Get error message from response
              setError({ general: errorData.message }); // Set error state with the message from the server
              return; // Exit the function if there's an error
            }
            
            const data = await response.json();

             // Store the token in localStorage
             localStorage.setItem('token', data.token);

             // Redirect user to another page or update state
             navigate('/landing');

        } catch(error){
          console.error("Unexpected error:", error);
          setError({ general: "Something went wrong. Please try again later." });
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

      <Link to="/forgot-password" className="forgot-password">
        Forgot Password?
      </Link>
      {error?.general && <p className="error-message">{error.general}</p>}
      <button className="create-account-btn" onClick={() => navigate('/signup')}>
        Create New Account
      </button>
    </div>
</div>
    );
}

export default Login;