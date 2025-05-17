import React, { useState, useEffect } from "react";

const ProfileView = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Fetch user profile data on component mount
  useEffect(() => {
    fetch("https://localhost:7151/api/Account/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPhoneNumber(data.phoneNumber || "");
      })
      .catch((err) => console.error("Failed to load profile", err));
  }, []);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedProfile = {
      firstName,
      lastName,
      phoneNumber,
    };

    fetch("https://localhost:7151/api/Account/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        alert("Profile updated successfully");
      })
      .catch((err) => console.error("Failed to update profile", err));
  };

  return (
    <div className="profile-container">
      <h2>Account Information</h2>
      <form onSubmit={handleSubmit}>
        <h3>User Information</h3>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Mobile</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default ProfileView;
