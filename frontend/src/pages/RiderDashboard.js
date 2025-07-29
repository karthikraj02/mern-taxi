import React, { useState, useEffect } from 'react';
import LocationAutocomplete from './LocationAutocomplete'; // your autocomplete component
import { requestRide, fetchRideStatus } from '../api/rideService';
import { Link } from 'react-router-dom';

import './RiderDashboard.css';
import image from '../assets/image.jpg';

export default function RiderDashboard({ user }) {
  const [pickup, setPickup] = useState(null);    // {address, location}
  const [dropoff, setDropoff] = useState(null);  // {address, location}
  const [currentRide, setCurrentRide] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [numPeople, setNumPeople] = useState(1);
  const [carType, setCarType] = useState('sedan');

  const handleRequest = async () => {
    if (!pickup?.address || !dropoff?.address) {
      setError('Please select pickup and dropoff locations.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const rideRequestPayload = {
        rider: user.id,
        pickup: pickup.address,
        pickupCoordinates: pickup.location,
        dropoff: dropoff.address,
        dropoffCoordinates: dropoff.location,
        numPeople,
        carType,
      };
      const res = await requestRide(rideRequestPayload);
      setCurrentRide(res.data);
      setPickup(null);
      setDropoff(null);
      setNumPeople(1);
      setCarType('sedan');
      localStorage.setItem('currentRideId', res.data._id);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request ride. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const rideId = localStorage.getItem('currentRideId');
    if (rideId) {
      fetchRideStatus(rideId)
        .then((res) => setCurrentRide(res.data.ride))
        .catch(() => setError('Failed to fetch ride status.'));
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div
      className="dashboard-background"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="dashboard-glass">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Welcome, {user.name} (Rider)</h2>
          <button className="logout-button" onClick={logout}>Logout</button>
        </div>

        <label className="label" htmlFor="pickup">
          Pickup Location
        </label>
        <LocationAutocomplete
          id="pickup"
          label="Pickup Location"
          onPlaceSelected={setPickup}
          value={pickup?.address || ''}
        />

        <label className="label" htmlFor="dropoff">
          Dropoff Location
        </label>
        <LocationAutocomplete
          id="dropoff"
          label="Dropoff Location"
          onPlaceSelected={setDropoff}
          value={dropoff?.address || ''}
        />

        <label className="label" htmlFor="numPeople">
          Number of People
        </label>
        <input
          id="numPeople"
          type="number"
          min={1}
          max={6}
          className="dashboard-input"
          placeholder="Number of People"
          value={numPeople}
          onChange={(e) => setNumPeople(Number(e.target.value))}
        />

        <label className="label" htmlFor="carType">
          Car Type
        </label>
        <select
          id="carType"
          className="dashboard-input"
          value={carType}
          onChange={(e) => setCarType(e.target.value)}
        >
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="minivan">Minivan</option>
        </select>

        <button
          className="request-button"
          onClick={handleRequest}
          disabled={loading}
          type="button"
        >
          {loading ? 'Requesting...' : 'Request Ride'}
        </button>

        {error && <p className="error-message">{error}</p>}

        {currentRide && (
          <div className="current-ride" aria-live="polite">
            <h3>Your Current Ride</h3>
            <p><strong>Status:</strong> {currentRide.status}</p>
            <p><strong>Pickup:</strong> {currentRide.pickup}</p>
            <p><strong>Dropoff:</strong> {currentRide.dropoff}</p>
            <p>
              <strong>Driver:</strong>{' '}
              {currentRide.driver ? currentRide.driver.name || currentRide.driver : 'Not assigned yet'}
            </p>
            <Link className="ride-link" to={`/ride/${currentRide._id}`}>
              View Ride Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
