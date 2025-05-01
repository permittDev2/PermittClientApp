import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./SignUpStyle.css";

function SignUpView() {
    
    console.log("SignUpView loaded");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [passwordHash, setPasswordHash] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "passwordHash": passwordHash,
            "phoneNumber": phoneNumber,
        };

        try{
            const response = await fetch('https://localhost:7151/api/Account/signup',{
             method: 'POST',
             headers: {
                'Content-Type': 'application/json'
             },
             body: JSON.stringify(userData),
            });

            const result = await response.json();

            if(!response.ok) {
                
                setValidationErrors({
                    emailValid: result.emailValid,
                    emailAvailable: result.emailAvailable,
                    passwordValid: result.passwordValid,
                    phoneNumberValid: result.phoneNumberValid,
                    firstName: result.firstName,
                    lastName: result.lastName
                });

                return; // Prevent further processing if validation failed
            }

             // Redirect user to another page
             navigate('/signup-success');

        }   catch(error){
            setError(error.message + " Please try again.");
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
                {validationErrors.firstName === false && (<p className="error-message">First name is required and must be valid.</p>)}
               <br />

               <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
               />
               {validationErrors.lastName === false && (<p className="error-message">Last name is required and must be valid.</p>)}
               <br />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
               />
               {validationErrors.emailValid === false && (
                    <p className="error-message">Invalid email format.</p>
                )}
                {validationErrors.emailAvailable === false && (
                    <p className="error-message">Email is already taken.</p>
                )}
               <br />

               <input
                 type="password"
                 placeholder="Password"
                 value={passwordHash}
                 onChange={(e) => setPasswordHash(e.target.value)}
                 required
                />
                {validationErrors.passwordValid === false && (
                    <p className="error-message">Password must contain at least one uppercase letter, one number, and one special character.</p>)}
               <br />

               <input
                type="phone"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
               />
               {validationErrors.phoneNumberValid === false && (<p className="error-message">Phone number is invalid.</p>)}
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