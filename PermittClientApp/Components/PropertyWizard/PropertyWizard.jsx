import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../src/assets/Permitt nav logo.png';
import { 
  PlusIcon, 
  UserCircleIcon, 
  DocumentTextIcon, 
  HomeIcon, 
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const steps = [
    { id: 'start', label: 'Start', status: 'completed' },
    { id: 'location', label: 'Location', status: 'current' },
    { id: 'propertyBasics', label: 'Property\nBasics', status: 'upcoming' },
    { id: 'rooms', label: 'Rooms', status: 'upcoming' },
    { id: 'roomOptions', label: 'Room\nOptions', status: 'upcoming' },
    { id: 'summary', label: 'Summary', status: 'upcoming' }
];

function PropertyWizard() {
    const [address, setAddress] = useState('');
    const [showMenu, setShowMenu] = useState(false);
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
            setEmail(payload?.email || "User");
        } catch (error) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setShowMenu(false);
        navigate("/login");
    };

    const handleNext = () => {
        // Handle next step navigation
        console.log('Moving to next step with address:', address);
    };

    {/* Menu Item Component */}
    function MenuItem({ icon, label, onClick }) {
        return (
          <div onClick={onClick} className="flex items-center space-x-3 p-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm">
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </div>
        );
      }

    const handleBack = () => {
        // Handle back navigation
        navigate(-1);
    };

    const bgColors = {
        red: 'bg-red-500',
        blue: 'bg-blue-600',
        green: 'bg-green-400',
      };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <img src={logo} alt="Permitt Logo" className="h-4" />
                        </div>
                        <div className="flex place-items-center space-x-10">
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
                                  <p className="font-medium">{email}</p>
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

            {/* Main Content */}
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                {/* Progress Bar */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="h-0.5 w-full bg-gray-200"></div>
                        </div>
                        <div className="relative flex justify-between">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        step.status === 'completed' || step.status === 'current'
                                            ? 'bg-[#3665D0] text-white'
                                            : 'bg-gray-200'
                                    }`}>
                                        {step.status === 'completed' ? '✓' : ''}
                                    </div>
                                    <div className="mt-2 text-sm text-center whitespace-pre-line">
                                        {step.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">Where will your house be built?</h1>
                    
                    <div className="space-y-4">
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Insert your address here!"
                            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500">
                            *If you're not sure or the Address isn't available, you can press Next to skip this step for now.
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12">
                        <div
                            onClick={handleBack}
                            className="px-6 py-2 bg-[#0D1A7E] text-white rounded-lg flex items-center cursor-pointer"
                        >
                            <span className="mr-2">←</span> Back
                        </div>
                        <div
                            onClick={handleNext}
                            className="px-6 py-2 bg-[#0D1A7E] text-white rounded-lg flex items-center cursor-pointer"
                        >
                            Next <span className="ml-2">→</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyWizard; 