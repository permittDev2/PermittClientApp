import React, { useEffect, useState } from "react";
import "./landingStyle.css";

function Landing() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setEmail(payload?.email || "User");
    }
  }, []);

  return (
    <div className="landing-container">
      <div className="welcome-box">
        <h1>Welcome {email}!</h1>
        <p>You have successfully logged in.</p>
      </div>
    </div>
  );
}

export default Landing;