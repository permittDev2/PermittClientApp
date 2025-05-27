import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function SignUpView() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [passwordHash, setPasswordHash] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Panel */}
            <div className="hidden md:flex flex-col justify-center items-center w-1/3 relative bg-contain bg-no-repeat bg-left" style={{ backgroundImage: "url('src/assets/left-panel-bg.png')" }}>
                
            </div>
            {/* Right Panel */}
            <div className="flex flex-col justify-between w-full md:w-2/3 bg-white relative">
                <div className="flex justify-end p-6">
                    <span className="text-sm text-gray-500">
                        Already A Member?{' '}
                        <a
                            href="#"
                            className="font-bold text-black hover:underline cursor-pointer"
                            onClick={e => { e.preventDefault(); navigate('/login'); }}
                        >
                            LOG IN NOW
                        </a>
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center flex-1 px-6 md:px-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">Every Masterpiece Begins With A Single Line<br className="hidden md:block"/>Start Yours Today</h2>
                    <form onSubmit={handleSubmit} className="w-full max-w-md mt-8 space-y-6">
                        <input
                            type="text"
                            placeholder="Marcus"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="w-full h-12 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        />
                        {validationErrors.firstName === false && (<p className="text-red-500 text-sm">First Name is required and must be valid.</p>)}
                        <input
                            type="text"
                            placeholder="Johnson"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="w-full h-12 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        />
                        {validationErrors.lastName === false && (<p className="text-red-500 text-sm">Last Name is required and must be valid.</p>)}
                        <input
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-12 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        />
                        {validationErrors.emailValid === false && (
                            <p className="text-red-500 text-sm">Invalid email format.</p>
                        )}
                        {validationErrors.emailAvailable === false && (
                            <p className="text-red-500 text-sm">Email is already taken.</p>
                        )}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={passwordHash}
                                onChange={(e) => setPasswordHash(e.target.value)}
                                required
                                className="w-full h-12 px-5 py-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                            />
                            <span
                                className="absolute right-6 top-1/2 -translate-y-1/4 text-sm font-bold text-gray-500 cursor-pointer select-none"
                                onClick={() => setShowPassword((prev) => !prev)}
                                tabIndex={-1}
                                role="button"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? "HIDE" : "SHOW"}
                            </span>
                        </div>
                        {validationErrors.passwordValid === false && (
                            <p className="text-red-500 text-sm">Password must contain at least one uppercase letter, one number, and one special character.</p>
                        )}
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="w-full h-12 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        />
                        {validationErrors.phoneNumberValid === false && (
                            <p className="text-red-500 text-sm">Please enter a valid phone number.</p>
                        )}
                        <button
                            type="submit"
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-lg mt-2 flex items-center justify-center transition-colors duration-200"
                        >
                            Become a Member <span className="ml-2 text-2xl">→</span>
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <div className="flex justify-between items-center px-6 py-4 text-xs text-black-400">
                    <span>Copyright 2025 Permitt AB. All Rights Reserved</span>
                    <span className="hover:underline cursor-pointer font-bold">Need Help?</span>
                </div>
            </div>
        </div>
    );
}

export default SignUpView;