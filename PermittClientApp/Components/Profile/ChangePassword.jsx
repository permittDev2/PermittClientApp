import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Navbar from "../Navbar/Navbar";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  // Add state for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/Account/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        alert(data.message);
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-left mb-12">Change Password</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D1A7E] focus:border-transparent"
                    required
                  />
                  <span
                    className="absolute right-6 top-1/2 -translate-y-1/4 text-sm font-bold text-gray-500 cursor-pointer select-none"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    tabIndex={-1}
                    role="button"
                    aria-label="Toggle password visibility"
                    >
                    {showCurrentPassword ? "HIDE" : "SHOW"}
                </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D1A7E] focus:border-transparent"
                    required
                  />
                  <span
                    className="absolute right-6 top-1/2 -translate-y-1/4 text-sm font-bold text-gray-500 cursor-pointer select-none"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    tabIndex={-1}
                    role="button"
                    aria-label="Toggle password visibility"
                    >
                    {showNewPassword ? "HIDE" : "SHOW"}
                </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D1A7E] focus:border-transparent"
                    required
                  />
                  <span
                    className="absolute right-6 top-1/2 -translate-y-1/4 text-sm font-bold text-gray-500 cursor-pointer select-none"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    tabIndex={-1}
                    role="button"
                    aria-label="Toggle password visibility"
                    >
                    {showConfirmPassword ? "HIDE" : "SHOW"}
                </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {success && (
              <div className="text-green-500 text-sm">{success}</div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 cursor-pointer bg-[#0D1A7E] text-white rounded-lg hover:bg-blue-900 transition-colors"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword; 