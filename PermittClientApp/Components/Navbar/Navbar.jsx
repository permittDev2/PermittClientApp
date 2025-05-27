import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  UserCircleIcon, 
  HomeIcon, 
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import logo from "../../src/assets/Permitt nav logo.png";

const Navbar = ({ showUpgradeButton = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserEmail(payload.email || '');
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowMenu(false);
    navigate("/login");
  };

  function MenuItem({ icon, label, onClick }) {
    return (
      <div onClick={onClick} className="flex items-center space-x-3 p-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm">
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img src={logo} alt="Permitt Logo" className="h-4" />
          </div>
          <div className="flex place-items-center space-x-10">
            {showUpgradeButton && (
              <div className="px-4 py-2 cursor-pointer border-2 border-[#0D1A7E] bg-white text-[#0D1A7E] rounded-lg text-sm font-medium flex items-center space-x-2">
                <PlusIcon className="w-4 h-4" />
                <span>Upgrade to permitt pro</span>
              </div>
            )}
            <div className="relative">
              <div
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 bg-[#0D1A7E] rounded-lg cursor-pointer"
              >
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
              
              {/* User Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 p-4">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div>
                      <p className="font-medium">{userEmail}</p>
                    </div>
                  </div>
                  <div className="mt-4 border-t pt-2 space-y-2">
                    <MenuItem 
                      icon={<HomeIcon className="w-5 h-5" />} 
                      label="Start" 
                      onClick={() => navigate("/dashboard")}
                    />
                     <MenuItem 
                        icon={<UserCircleIcon className="w-5 h-5" />} 
                        label="My Profile" 
                        onClick={() => navigate("/profile")}
                      />
                    <MenuItem 
                      icon={<ArrowRightOnRectangleIcon className="w-5 h-5" />} 
                      label="Log Out" 
                      onClick={handleLogout}
                    />
                  </div>
                  
                  <div className="mt-4 border-t pt-2">
                    <div 
                      onClick={() => setShowMenu(false)} 
                      className="w-full flex items-center justify-center space-x-2 p-2 cursor-pointer bg-[#0D1A7E] text-white hover:bg-blue-900 rounded-md"
                    >
                      <span>Close</span>
                      <XMarkIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 