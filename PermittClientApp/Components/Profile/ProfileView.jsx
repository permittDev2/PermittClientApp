import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { LockClosedIcon } from '@heroicons/react/24/outline';

const ProfileView = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Display states
  const [displayFirstName, setDisplayFirstName] = useState("");
  const [displayLastName, setDisplayLastName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expirationTime) {
        // Token has expired
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      // Fetch user profile data
      fetch('http://localhost:8080/api/Account/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch profile");
          }
          return res.json();
        })
        .then((data) => {
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setPhoneNumber(data.phoneNumber || "");
          setUsername(data.username || "");
          // Set display values
          setDisplayFirstName(data.firstName || "");
          setDisplayLastName(data.lastName || "");
        })
        .catch((err) => {
          console.error("Failed to load profile", err);
          localStorage.removeItem("token");
          navigate("/login");
        });
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProfile = {
      firstName,
      lastName,
      phoneNumber,
    };

    try{
      const response = await fetch("https://localhost:7151/api/Account/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedProfile),
      });

    const result = await response.json();
        if (!response.ok) {

          setValidationErrors({
            firstName: result.firstName,
            lastName: result.lastName,
            phoneNumber: result.phoneNumber
          });
          return;
        }
        // Update display values after successful save
        setDisplayFirstName(firstName);
        setDisplayLastName(lastName);
        setValidationErrors({});
        alert("Profile updated successfully");
      }  
        catch(error){
        setError(error.message + "Failed to update profile");
      }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">My Profile</h1>
          <a 
            href="/changepassword" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/changepassword');
            }}
            className="flex items-center space-x-2 text-[#0D1A7E] hover:text-blue-700 transition-colors underline"
          >
            <LockClosedIcon className="h-5 w-5" />
            <span className="font-semibold">Change Password</span>
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* User Name Display */}
          <div className="text-left mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              {displayFirstName} {displayLastName}
            </h2>
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-800">
                Username
              </h3>
              <p className="text-gray-600 mt-2">{username}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D1A7E] focus:border-transparent"
                />
                {validationErrors.firstName === false && (
                  <p className="text-red-500 text-sm mt-1">First Name is required and must be valid.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D1A7E] focus:border-transparent"
                />
                {validationErrors.lastName === false && (
                  <p className="text-red-500 text-sm mt-1">Last Name is required and must be valid.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D1A7E] focus:border-transparent"
                />
                {validationErrors.phoneNumber === false && (
                  <p className="text-red-500 text-sm mt-1">Please enter a valid phone number.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 cursor-pointer bg-[#0D1A7E] text-white rounded-lg hover:bg-blue-900 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
