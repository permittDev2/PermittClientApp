import React, { useEffect, useState } from "react";
import { getApiUrl } from '../../src/config/api';
import { useSearchParams, useNavigate } from "react-router-dom";

function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
  
    const confirmEmail = async () => {
      try {
        const response = await fetch(getApiUrl('account/confirm-email'), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }), // send token in request body
        });

        const data = await response.json();
  
        if (!response.ok) {
          setMessage(`❌ ${data.message || "Email confirmation failed."}`);
          if (data.message?.toLowerCase().includes("expired")) {
            setMessage(
              <>
                ❌ {data.message}
                <br />
                <button onClick={() => navigate("/resend-confirmation")}>
                  Resend confirmation email
                </button>
              </>
            );
          }
          return;
        }
  
        setMessage(`✅ ${data.message} Redirecting to login...`);
        setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
      } catch (error) {
        console.error("Unexpected error:", error);
        setMessage( "❌Something went wrong. Please try again later." );
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
