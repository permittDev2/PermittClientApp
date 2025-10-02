import React, { useState } from "react";
import { getApiUrl } from '../../src/config/api';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const credentials = {
            "email": email,
            "password": password,
        };

        try {
            const response = await fetch(getApiUrl('Account/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message?.toLowerCase().includes("not confirmed")) {
                    setError(
                        <>
                            {errorData.message}
                            <br />
                            <button onClick={() => navigate("/resend-confirmation")}>
                                Resend Confirmation Email
                            </button>
                        </>
                    );
                } else {
                    setError(errorData.message);
                }
                return;
            }

            const data = await response.json();

             // Store the token in localStorage
             localStorage.setItem('token', data.token);

             // Redirect user to another page or update state
             navigate('/dashboard');

        } catch (error) {
            console.error("Unexpected error:", error);
            setError("Something went wrong. Please try again later.");
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
                        Not A Member Yet?{' '}
                        <a
                            href="#"
                            className="font-bold text-black hover:underline cursor-pointer"
                            onClick={e => { e.preventDefault(); navigate('/'); }}
                        >
                            JOIN NOW
                        </a>
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center flex-1 px-6 md:px-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">Welcome Back!<br className="hidden md:block"/> Let's continue building</h2>
                    <form onSubmit={handleSubmit} className="w-full max-w-md mt-8 space-y-6">
                        <input
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-12 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        <div className="flex justify-start">
                            <a
                                href="#"
                                className="text-sm text-gray-500 hover:underline"
                                onClick={e => { e.preventDefault(); navigate('/forgot-password'); }}
                            >
                                Forgot Password?
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-lg mt-2 flex items-center justify-center transition-colors duration-200"
                        >
                            Sign In <span className="ml-2 text-2xl">→</span>
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

export default Login;