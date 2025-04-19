import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
  
    const confirmEmail = async () => {
      try {
        const response = await fetch("https://localhost:7151/api/account/confirm-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }), // send token in request body
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Email confirmation failed");
        }
  
        const successText = await response.text();
        setMessage(`✅ ${successText} Redirecting to login...`);
        setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
      } catch (error) {
        setMessage(`❌ ${error.message}`);
      }
    };
  
    if (token) {
      confirmEmail();
    } else {
      setMessage("❌ No confirmation link found in URL.");
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{message}</h2>
    </div>
  );
}

export default ConfirmEmail;
