import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResendConfirmationStyle.css"; 

function ResendConfirmationView() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleResend = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const response = await fetch('http://localhost:8080/api/resend-confirmation-email', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Failed to resend confirmation email.");
            } else {
                setMessage(`✅ ${result.message} Redirecting to login...` 
                    || "A new confirmation link has been sent. Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
            }
            
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="resend-confirmation-container">
            <div className="resend-confirmation-box">
                <h2>Resend Confirmation Email</h2>
                <form onSubmit={handleResend}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Resend Email</button>
                </form>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                <button className="back-to-login" onClick={() => navigate("/login")}>
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default ResendConfirmationView;
