import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import Navbar from '../Navbar/Navbar';

const Dashboard = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

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
      
      setEmail(payload?.email || "");
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleCreateCase = () => {
    navigate("/property-wizard");
  };

  const handleViewCases = () => {
    navigate("/my-cases");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showUpgradeButton={true} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Permitt
          </h1>
          <p className="text-xl text-gray-600">
            What would you like to do today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create New Case Button */}
          <div 
            onClick={handleCreateCase}
            className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-[#0D1A7E]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#0D1A7E] rounded-full flex items-center justify-center mb-4">
                <PlusIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Create New Case
              </h2>
              <p className="text-gray-600">
                Start a new property case and begin your journey
              </p>
            </div>
          </div>

          {/* View Cases Button */}
          <div 
            onClick={handleViewCases}
            className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 border-[#0D1A7E]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#0D1A7E] rounded-full flex items-center justify-center mb-4">
                <FolderIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                My Cases
              </h2>
              <p className="text-gray-600">
                View and manage your existing property cases
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 