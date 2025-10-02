import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../src/config/api';
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
    const [currentStep, setCurrentStep] = useState(1);
    const [currentFloor, setCurrentFloor] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    // State for all form data
    const generateUuid = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        // Fallback UUID v4 generator
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const [formData, setFormData] = useState(() => ({
        designPreferencesId: generateUuid(),
        location: {
            street: '',
            postalCode: '',
            city: ''
        },
        measurementUnit: 'metric',
        numberOfFloors: 1,
        area: 0,
        floors: [
            {
                name: 'First Floor',
                rooms: [
                    { type: "", number: 0, extras: [""] },
                ]
            }
        ],
        additionalNotes: ''
    }));

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

    const handleNext = async () => {
        if (currentStep === steps.length - 1) {
            // Submit the final data
            try {
                // First, call AI model to generate floorplan
                let aiData = null;
                try {
                    const aiResponse = await fetch('http://localhost:8000/generate-floorplan_V1', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    if (!aiResponse.ok) {
                        const aiErrorText = await aiResponse.text();
                        console.warn(`AI generation failed: ${aiResponse.status} ${aiResponse.statusText} - ${aiErrorText}`);
                    } else {
                        aiData = await aiResponse.json();
                        console.log('AI floorplan generated successfully:', aiData);
                    }
                } catch (aiError) {
                    console.error('Error calling AI model:', aiError);
                }

                const token = localStorage.getItem('token');
                console.log("Submitting formData:", JSON.stringify(formData, null, 2));
                
                const payload = {
                    ...formData,
                    Id: formData.designPreferencesId,
                    AreaPerFloor: formData.area,
                    AdditionalNotes: formData.additionalNotes
                };

                const response = await fetch(getApiUrl('Case'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to submit case: ${response.status} ${response.statusText} - ${errorText}`);
                }

                const data = await response.json();
                console.log('Case submitted successfully:', data);
                const designId = aiData?.id || aiData?.designId || data?.designPreferencesId || data?.id;
                navigate(`/design/${designId || 'preview'}`, { state: { aiData, formData } });
            } catch (error) {
                console.error('Error submitting case:', error);
                alert(`Error submitting case: ${error.message}`);
            }
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep === 0) {
            navigate(-1);
        } else {
            setCurrentStep(prev => prev - 1);
        }
    };

    const updateFormData = (field, value) => {
        setFormData(prev => {
            const newData = {
                ...prev,
                [field]: value
            };
            
            // Handle floor creation when numberOfFloors changes
            if (field === 'numberOfFloors') {
                const floorNames = ['First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor', 'Fifth Floor'];
                newData.floors = [];
                for (let i = 0; i < value; i++) {
                    newData.floors.push({
                        name: floorNames[i] || `Floor ${i + 1}`,
                        rooms: []
                    });
                }
            }
            
            return newData;
        });
    };

    const getRoomQuantity = (floorIndex, roomType) => {
        const floor = formData.floors[floorIndex];
        if (!floor) return 0;
        return floor.rooms.filter(room => room.type === roomType).length;
    };

    const updateRoomQuantity = (floorIndex, roomType, quantity) => {
        setFormData(prev => {
            const newFloors = [...prev.floors];
            const floor = newFloors[floorIndex];
            
            if (!floor) return prev;

            // Remove existing rooms of this type
            floor.rooms = floor.rooms.filter(room => room.type !== roomType);
            
            // Add new rooms of this type
            for (let i = 1; i <= quantity; i++) {
                floor.rooms.push({
                    type: roomType,
                    number: i,
                    extras: []
                });
            }

            return {
                ...prev,
                floors: newFloors
            };
        });
    };

    const getRoomExtra = (floorIndex, roomType, roomNumber, extra) => {
        const floor = formData.floors[floorIndex];
        if (!floor) return false;
        const room = floor.rooms.find(r => r.type === roomType && r.number === roomNumber);
        return room ? room.extras.includes(extra) : false;
    };

    const updateRoomExtra = (floorIndex, roomType, roomNumber, extra, value) => {
        setFormData(prev => {
            const newFloors = [...prev.floors];
            const floor = newFloors[floorIndex];
            
            if (!floor) return prev;

            const room = floor.rooms.find(r => r.type === roomType && r.number === roomNumber);
            if (!room) return prev;

            if (value) {
                if (!room.extras.includes(extra)) {
                    room.extras.push(extra);
                }
            } else {
                room.extras = room.extras.filter(e => e !== extra);
            }

            return {
                ...prev,
                floors: newFloors
            };
        });
    };

    const generateRoomCards = (floorIndex) => {
        const floor = formData.floors[floorIndex];
        if (!floor) return [];
        
        const roomCards = [];

        // Define room features for each room type
        const roomFeatures = {
            'Bed room': ['Walk-in Closet', 'Balcony', 'Closet'],
            'Kitchen': ['Pantry', 'Balcony'],
            'Living room': ['Balcony'],
            'Dining room': ['Balcony'],
            'Entry': ['Closet'],
            'Garage': ['Storage'],
            'Laundry': ['Storage'],
            'Mudroom': ['Closet']
        };

        // Group rooms by type
        const roomsByType = {};
        floor.rooms.forEach(room => {
            if (!roomsByType[room.type]) {
                roomsByType[room.type] = [];
            }
            roomsByType[room.type].push(room);
        });

        // Generate cards for each room
        Object.entries(roomsByType).forEach(([roomType, rooms]) => {
            rooms.forEach(room => {
                const roomName = `${room.type} ${room.number}`;
                const features = roomFeatures[room.type] || [];
                
                roomCards.push(
                    <div key={`${floorIndex}-${room.type}-${room.number}`} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg mb-4">{roomName}</h3>
                        <div className="space-y-3">
                            {features.map((feature) => (
                                <label key={feature} className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={getRoomExtra(floorIndex, room.type, room.number, feature)}
                                        onChange={(e) => updateRoomExtra(floorIndex, room.type, room.number, feature, e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span>{feature}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            });
        });

        return roomCards;
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Location
                return (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Street Address"
                            value={formData.location.street || ''}
                            onChange={(e) => updateFormData('location', { ...formData.location, street: e.target.value })}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Postal Code"
                            value={formData.location.postalCode || ''}
                            onChange={(e) => updateFormData('location', { ...formData.location, postalCode: e.target.value })}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="City"
                            value={formData.location.city || ''}
                            onChange={(e) => updateFormData('location', { ...formData.location, city: e.target.value })}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                );
            case 2: // Property Basics
                return (
                    <div className="space-y-4">
                        <div className="w-full p-4 flex items-center justify-between">
                            <label className="font-medium mr-4">Measurement unit</label>
                            <div className="flex items-center space-x-6">
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="measurementUnit"
                                        value="metric"
                                        checked={formData.measurementUnit === 'metric'}
                                        onChange={() => updateFormData('measurementUnit', 'metric')}
                                        className="form-radio h-5 w-5 text-blue-600"
                                    />
                                    <span>Metric (m²)</span>
                                </label>
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="measurementUnit"
                                        value="imperial"
                                        checked={formData.measurementUnit === 'imperial'}
                                        onChange={() => updateFormData('measurementUnit', 'imperial')}
                                        className="form-radio h-5 w-5 text-blue-600"
                                    />
                                    <span>Imperial (ft²)</span>
                                </label>
                            </div>
                        </div>
                        <div className="w-full p-4 flex items-center justify-between">
                            <label className="font-medium mr-4">Number of floors</label>
                            <div className="flex items-center space-x-6">
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="numberOfFloors"
                                        value="1"
                                        checked={formData.numberOfFloors === 1}
                                        onChange={() => updateFormData('numberOfFloors', 1)}
                                        className="form-radio h-5 w-5 text-blue-600"
                                    />
                                    <span>One floor</span>
                                </label>
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="numberOfFloors"
                                        value="2"
                                        checked={formData.numberOfFloors === 2}
                                        onChange={() => updateFormData('numberOfFloors', 2)}
                                        className="form-radio h-5 w-5 text-blue-600"
                                    />
                                    <span>Two floors</span>
                                </label>
                            </div>
                        </div>
                        <div className="w-full p-4 flex items-center justify-between">
                            <label className="font-medium mr-4">Area</label>
                            <input
                                type="number"
                                placeholder="Exp 148"
                                value={Number.isFinite(formData.area) ? formData.area : ''}
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    updateFormData('area', isNaN(value) ? 0 : value);
                                }}
                                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ width: '200px' }}
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                );
            case 3: // Rooms
                return (
                    <div className="space-y-6">
                        {/* Floor Selection Tabs */}
                        <div className="flex space-x-2">
                            {Array.from({ length: formData.numberOfFloors }).map((_, floorIndex) => (
                                <button
                                    key={floorIndex}
                                    onClick={() => setCurrentFloor(floorIndex)}
                                    className={`px-4 py-2 rounded-lg border ${
                                        currentFloor === floorIndex
                                            ? 'bg-white border-blue-500 text-blue-500'
                                            : 'bg-gray-200 border-gray-300 text-gray-600'
                                    }`}
                                >
                                    {floorIndex === 0 ? 'first floor' : floorIndex === 1 ? 'second floor' : `floor ${floorIndex + 1}`}
                                </button>
                            ))}
                        </div>

                        {/* Room Selection */}
                        <div className="grid grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-4">
                                {['Bed room', 'Kitchen', 'Living room', 'Dining room'].map((roomType) => (
                                    <RoomSelector
                                        key={roomType}
                                        roomType={roomType}
                                        quantity={getRoomQuantity(currentFloor, roomType)}
                                        onQuantityChange={(quantity) => updateRoomQuantity(currentFloor, roomType, quantity)}
                                    />
                                ))}
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {['Entry', 'Garage', 'Laundry', 'Mudroom'].map((roomType) => (
                                    <RoomSelector
                                        key={roomType}
                                        roomType={roomType}
                                        quantity={getRoomQuantity(currentFloor, roomType)}
                                        onQuantityChange={(quantity) => updateRoomQuantity(currentFloor, roomType, quantity)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4: // Room Options
                return (
                    <div className="space-y-6">
                        {/* Floor Selection Tabs */}
                        <div className="flex space-x-2">
                            {Array.from({ length: formData.numberOfFloors }).map((_, floorIndex) => (
                                <button
                                    key={floorIndex}
                                    onClick={() => setCurrentFloor(floorIndex)}
                                    className={`px-4 py-2 rounded-lg border ${
                                        currentFloor === floorIndex
                                            ? 'bg-white border-blue-500 text-blue-500'
                                            : 'bg-gray-200 border-gray-300 text-gray-600'
                                    }`}
                                >
                                    {floorIndex === 0 ? 'first floor' : floorIndex === 1 ? 'second floor' : `floor ${floorIndex + 1}`}
                                </button>
                            ))}
                        </div>

                        {/* Room Cards Grid */}
                        <div className="grid grid-cols-2 gap-6">
                            {generateRoomCards(currentFloor)}
                        </div>
                    </div>
                );
            case 5: // Summary
                return (
                    <div className="space-y-4">
                        <h3 className="font-bold text-xl mb-6">Summary of Your Design</h3>
                        
                        {/* Location */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="font-bold text-lg mb-3 text-blue-600">Location</h4>
                            <p><strong>Street:</strong> {formData.location.street || 'Not specified'}</p>
                            <p><strong>Postal Code:</strong> {formData.location.postalCode || 'Not specified'}</p>
                            <p><strong>City:</strong> {formData.location.city || 'Not specified'}</p>
                        </div>

                        {/* Property Basics */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="font-bold text-lg mb-3 text-blue-600">Property Basics</h4>
                            <p><strong>Measurement Unit:</strong> {formData.measurementUnit === 'metric' ? 'Metric (m²)' : 'Imperial (ft²)'}</p>
                            <p><strong>Number of Floors:</strong> {formData.numberOfFloors === 1 ? 'One floor' : 'Two floors'}</p>
                            <p><strong>Area:</strong> {formData.area || 0}</p>
                        </div>

                        {/* Room Quantities by Floor */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="font-bold text-lg mb-3 text-blue-600">Room Quantities</h4>
                            {formData.floors.map((floor, floorIndex) => {
                                const floorName = floor.name;
                                
                                // Group rooms by type and count them
                                const roomCounts = {};
                                floor.rooms.forEach(room => {
                                    roomCounts[room.type] = (roomCounts[room.type] || 0) + 1;
                                });
                                
                                return (
                                    <div key={floorIndex} className="mb-4">
                                        <h5 className="font-semibold mb-2">{floorName}</h5>
                                        {Object.keys(roomCounts).length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {Object.entries(roomCounts).map(([roomType, count]) => (
                                                    <p key={roomType} className="text-sm">
                                                        <span className="font-medium">{roomType}:</span> {count}
                                                    </p>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">No rooms selected</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Room Extras by Floor */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="font-bold text-lg mb-3 text-blue-600">Room Extras & Features</h4>
                            {formData.floors.map((floor, floorIndex) => {
                                const floorName = floor.name;
                                
                                // Group rooms with extras
                                const roomsWithExtras = floor.rooms.filter(room => room.extras.length > 0);
                                
                                return (
                                    <div key={floorIndex} className="mb-4">
                                        <h5 className="font-semibold mb-2">{floorName}</h5>
                                        {roomsWithExtras.length > 0 ? (
                                            <div className="space-y-2">
                                                {roomsWithExtras.map((room) => (
                                                    <div key={`${room.type}-${room.number}`} className="text-sm">
                                                        <span className="font-medium">{room.type} {room.number}:</span> {room.extras.join(', ')}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">No extras selected</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Additional Notes */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="font-bold text-lg mb-3 text-blue-600">Additional Notes</h4>
                            <textarea
                                placeholder="Add any additional notes or special requirements..."
                                value={formData.additionalNotes}
                                onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
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

    {/* Room Selector Component */}
    function RoomSelector({ roomType, quantity, onQuantityChange }) {
        return (
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-700">{roomType}</span>
                    <span className="text-gray-400">→</span>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                        -
                    </button>
                    <div className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 bg-white">
                        {quantity}
                    </div>
                    <button
                        onClick={() => onQuantityChange(quantity + 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                        +
                    </button>
                </div>
            </div>
        );
    }

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
                                        index < currentStep ? 'bg-[#3665D0] text-white' :
                                        index === currentStep ? 'bg-[#3665D0] text-white' :
                                        'bg-gray-200'
                                    }`}>
                                        {index < currentStep ? '✓' : ''}
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
                    <h1 className="text-3xl font-bold text-center mb-8">
                        {currentStep === 1 ? "Where will your house be built?" :
                         currentStep === 2 ? "Tell us about your property" :
                         currentStep === 3 ? "Let's plan your rooms" :
                         currentStep === 4 ? "Customize your rooms" :
                         "Review your design"}
                    </h1>
                    
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12">
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 bg-[#0D1A7E] text-white rounded-lg flex items-center cursor-pointer"
                        >
                            <span className="mr-2">←</span> Back
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-[#0D1A7E] text-white rounded-lg flex items-center cursor-pointer"
                        >
                            {currentStep === steps.length - 1 ? 'Submit' : 'Next'} <span className="ml-2">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyWizard; 