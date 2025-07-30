// /frontend/src/pages/RiderDashboard.js

import React, { useState, useEffect } from 'react';
import LocationAutocomplete from './LocationAutocomplete'; // Your autocomplete component
import { requestRide, fetchRideStatus } from '../api/rideService';
import { Link } from 'react-router-dom';

import './RiderDashboard.css';
import image from '../assets/image.jpg';

export default function RiderDashboard({ user }) {
  const [pickup, setPickup] = useState(null);       // { address, location }
  const [dropoff, setDropoff] = useState(null);     // { address, location }
  const [currentRide, setCurrentRide] = useState(null);
  const [error, setError] = useState('');
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [loadingRideStatus, setLoadingRideStatus] = useState(false);
  const [numPeople, setNumPeople] = useState(1);
  const [carType, setCarType] = useState('sedan');

  const token = localStorage.getItem('token');

  // Fetch current ride status if saved ride ID exists
  const fetchCurrentRideStatus = async () => {
    const rideId = localStorage.getItem('currentRideId');
    if (!rideId) return;
    setLoadingRideStatus(true);
    try {
      const res = await fetchRideStatus(rideId, token);
      setCurrentRide(res.data.ride || res.data);
      setError('');
    } catch {
      setError('Failed to fetch ride status.');
    } finally {
      setLoadingRideStatus(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCurrentRideStatus();
    }
  }, [user]);

  // Handle ride request submission
  const handleRequest = async () => {
    if (!pickup?.address || !dropoff?.address) {
      setError('Please select pickup and dropoff locations.');
      return;
    }
    setError('');
    setLoadingRequest(true);
    try {
      const payload = {
        rider: user.id,
        pickup: pickup.address,
        pickupCoordinates: pickup.location,
        dropoff: dropoff.address,
        dropoffCoordinates: dropoff.location,
        numPeople,
        carType,
      };

      const res = await requestRide(payload, token);

      setCurrentRide(res.data);

      // Reset form fields after successful request
      setPickup(null);
      setDropoff(null);
      setNumPeople(1);
      setCarType('sedan');

      localStorage.setItem('currentRideId', res.data._id);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request ride. Please try again.');
    } finally {
      setLoadingRequest(false);
    }
  };

  // Logout clears localStorage and redirects to login
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentRideId');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div
      className="dashboard-background"
      role="main"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className="dashboard-glass" aria-live="polite">
        <header className="dashboard-header">
          <h2 className="dashboard-title">Welcome, {user.name} (Rider)</h2>
          <button
            className="logout-button"
            onClick={logout}
            aria-label="Logout"
          >
            Logout
          </button>
        </header>

        {error && <p className="error-message">{error}</p>}

        <label className="label" htmlFor="pickup">
          Pickup Location
        </label>
        <LocationAutocomplete
          id="pickup"
          label="Pickup Location"
          onPlaceSelected={setPickup}
        />

        <label className="label" htmlFor="dropoff">
          Dropoff Location
        </label>
        <LocationAutocomplete
          id="dropoff"
          label="Dropoff Location"
          onPlaceSelected={setDropoff}
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
          disabled={loadingRequest}
          type="button"
          aria-busy={loadingRequest}
        >
          {loadingRequest ? 'Requesting...' : 'Request Ride'}
        </button>

        {loadingRequest && <p>Sending ride request...</p>}

        {currentRide && (
          <section className="current-ride" aria-live="polite" aria-label="Current Ride Details">
            <h3>Your Current Ride</h3>
            <p><strong>Status:</strong> {currentRide.status}</p>
            <p><strong>Pickup:</strong> {currentRide.pickup}</p>
            <p><strong>Dropoff:</strong> {currentRide.dropoff}</p>
            <p>
              <strong>Driver:</strong>{' '}
              {currentRide.driver ? (currentRide.driver.name || currentRide.driver) : 'Not assigned yet'}
            </p>
            <Link className="ride-link" to={`/ride/${currentRide._id}`}>
              View Ride Details
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
