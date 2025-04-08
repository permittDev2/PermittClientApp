import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./SignUpStyle.css";

function SignUpView() {
    
    console.log("SignUpView loaded");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "password": password,
            "phoneNumber": phoneNumber,
        };

        try{
            const response = await fetch('https://localhost:7116/api/Drivers',{
             method: 'POST',
             headers: {
                'Content-Type': 'application/json'
             },
             body: JSON.stringify(userData),
            });

            if(!response.ok) {
                throw new Error ('Registration failed');
            }

            alert("Account created successfully! You can now log in.");

             // Redirect user to another page or update state
             navigate('/');

        }   catch(error){
            setError(error.message);
        }
    };


    return(
    <div className="signup-container">
      <div className="signup-box">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
               />
               <br />
               <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
               />
               <br />
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
               <input
                type="phone"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
               />
               <br />
               <button type="submit">SignUp</button>
            </form>
                {error && <p className="error-message">{error}</p>}

                <button className="back-to-login" onClick={() => navigate('/')}>
                    Back to Login
                </button>
        </div>
    </div>
    );
}

export default SignUpView;