import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import image from '../assets/image.jpg';

import './RideStatus.css';

export default function RideStatus() {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/rides/status/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRide(res.data.ride);
      } catch (err) {
        setError('Failed to fetch ride details.');
      }
    };

    if (!token) {
      navigate('/login');
    } else {
      fetchRide();
    }
  }, [rideId, token, navigate]);

  if (error)
    return <p className="error-message" role="alert">{error}</p>;
  if (!ride)
    return <p className="loading-message">Loading ride details...</p>;

  return (
    <div className="ride-background"
        style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
    
      <div className="ride-glass" role="main" aria-live="polite" aria-label="Ride Details">
        <h2 className="ride-header">Ride Details</h2>
        <div className="ride-info">
          <p><strong>Status:</strong> {ride.status}</p>
          <p><strong>Pickup Location:</strong> {ride.pickup}</p>
          <p><strong>Dropoff Location:</strong> {ride.dropoff}</p>
          <p><strong>Rider:</strong> {ride.rider?.name || 'Unknown'}</p>
          <p><strong>Driver:</strong> {ride.driver?.name || 'Not assigned yet'}</p>
        </div>

        <button className="back-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}
