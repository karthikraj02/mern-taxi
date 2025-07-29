import React, { useState } from 'react';
import { requestRide } from '../api/rideService';

export default function RiderDashboard({ user }) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  
  // Paste your function here
  const token = localStorage.getItem('token');

  const handleRequest = async () => {
    try {
      const response = await requestRide({ rider: user.id, pickup, dropoff }, token);
      // handle response, e.g., show ride status or confirmation
    } catch (err) {
      // handle error, e.g., show error message
    }
  };

  return (
    <div>
      {/* Form inputs for pickup and dropoff */}
      <input value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Pickup" />
      <input value={dropoff} onChange={e => setDropoff(e.target.value)} placeholder="Dropoff" />
      <button onClick={handleRequest}>Request Ride</button>
    </div>
  );
}
