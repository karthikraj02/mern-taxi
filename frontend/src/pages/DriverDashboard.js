import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DriverDashboard.css';
import image from '../assets/image.jpg';

export default function DriverDashboard({ user }) {
  const [pendingRides, setPendingRides] = useState([]);
  const [currentRides, setCurrentRides] = useState([]);
  const [error, setError] = useState('');
  const [loadingAccept, setLoadingAccept] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  // Fetch pending ride requests
  const fetchPendingRides = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/rides/pending`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingRides(res.data.rides);
      setError('');
    } catch {
      setError('Failed to load pending rides');
    }
  };

  // Fetch current accepted rides for this driver
  const fetchCurrentRides = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/rides/driver/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentRides(res.data.rides);
      setError('');
    } catch {
      setError('Failed to load current rides');
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPendingRides();
      fetchCurrentRides();
    }
  }, [user]);

  // Accept ride handler
  const acceptRide = async (rideId) => {
    setLoadingAccept(rideId);
    try {
      await axios.post(
        `${API_BASE_URL}/rides/accept/${rideId}`,
        { driver: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPendingRides();
      await fetchCurrentRides();
      setError('');
    } catch {
      setError('Failed to accept ride');
    } finally {
      setLoadingAccept(null);
    }
  };

  // Simple logout
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div
      className="dashboard-background"
      role="main"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="dashboard-glass" aria-live="polite">
        <header className="dashboard-header">
          <h2 className="dashboard-title">
            Welcome, {user.name} (Driver)
          </h2>
          <button
            className="logout-button"
            onClick={logout}
            aria-label="Logout"
          >
            Logout
          </button>
        </header>

        {error && <p className="error-message">{error}</p>}

        <section aria-labelledby="pending-rides-title">
          <h3 id="pending-rides-title" className="section-title">
            Pending Ride Requests
          </h3>
          {pendingRides.length === 0 ? (
            <p className="empty-message">
              No pending rides at the moment.
            </p>
          ) : (
            <ul className="ride-list">
              {pendingRides.map((ride) => (
                <li key={ride._id} className="ride-item">
                  <p className="ride-info">
                    <strong>Pickup:</strong> {ride.pickup} |{' '}
                    <strong>Dropoff:</strong> {ride.dropoff}
                  </p>
                  <button
                    className="accept-button"
                    onClick={() => acceptRide(ride._id)}
                    disabled={loadingAccept === ride._id}
                    aria-label={`Accept ride from ${ride.pickup} to ${ride.dropoff}`}
                  >
                    {loadingAccept === ride._id
                      ? 'Accepting...'
                      : 'Accept Ride'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="current-rides-title">
          <h3 id="current-rides-title" className="section-title">
            Your Current Rides
          </h3>
          {currentRides.length === 0 ? (
            <p className="empty-message">
              You have no accepted rides currently.
            </p>
          ) : (
            <ul className="ride-list">
              {currentRides.map((ride) => (
                <li key={ride._id} className="ride-item">
                  <p className="ride-info">
                    <strong>Status:</strong> {ride.status}
                  </p>
                  <p className="ride-info">
                    <strong>Pickup:</strong> {ride.pickup} |{' '}
                    <strong>Dropoff:</strong> {ride.dropoff}
                  </p>
                  <p className="ride-info">
                    <strong>Rider:</strong>{' '}
                    {ride.rider?.name || ride.rider}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
