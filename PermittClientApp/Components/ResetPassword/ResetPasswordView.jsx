import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './ResetPasswordStyle.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    //Check if passwords match before sending request
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess('');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/account/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(`✅ ${data.message} Redirecting to login...`);
        setError('');
        setTimeout(() => navigate("/login"), 3000); // Redirect to login page
      } else {
        setError(`❌ ${data.message 
          || "Unfortunately, something is wrong, Try again or connect the support team."}`);
        setSuccess('');
      }
    } catch (error) {
      setError(`❌ Error: ${error.message}`);
      setSuccess('');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;