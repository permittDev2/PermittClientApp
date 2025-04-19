import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./DriverProfileStyle.css";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch('https://localhost:7116/api/Drivers/Profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        console.log(token);

        const data = await response.json();
        setDriver(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/"); // Redirect to login
};

if (loading) return <div className="container"><p>Loading...</p></div>;
if (error) return <div className="container"><p>Error: {error}</p></div>;

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Welcome, {driver?.firstName}!</h2>
            <p className="info"><strong>Name:</strong> {driver?.firstName} {driver.lastName}</p>
            <p className="info"><strong>Email:</strong> {driver?.email}</p>
            <p className="info"><strong>Phone:</strong> {driver?.phoneNumber}</p>
            <p className="info"><strong>LicenseType:</strong> {driver?.licenseType}</p>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default UserProfile;