import React, { useState } from 'react';
import './RequestPasswordResetStyle.css'; 

function RequestPasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7151/api/account/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ ${data.message || "Reset link has sent! Please check your email."}`);
      } else {
        setMessage(`❌ ${data.message || "Failed to send reset link."}`);
      }
    } catch (error) {
      setMessage(`❌ Unexpected error: ${error.message}`);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default RequestPasswordReset;
