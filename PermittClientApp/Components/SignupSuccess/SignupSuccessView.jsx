import React from "react";
import { useNavigate } from "react-router-dom";
import "./SignupSuccessStyle.css";

function SignupSuccessView() {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <div className="success-box">
        <h2>Account Created Successfully</h2>
        <p className="success-message">
          Your account has been created successfully. A confirmation email has been sent to your registered email address. <br />
          Please confirm your email to activate your account before logging in.
        </p>
        <button className="login-button" onClick={() => navigate("/")}>
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default SignupSuccessView;
