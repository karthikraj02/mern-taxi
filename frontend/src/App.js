// /frontend/src/App.js

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import RiderDashboard from './pages/RiderDashboard';
import DriverDashboard from './pages/DriverDashboard';
import RideStatus from './pages/RideStatus';

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  // Persist logged‐in user across refreshes
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Keep localStorage in sync
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Rider Dashboard (protected) */}
        <Route
          path="/rider"
          element={
            <PrivateRoute user={user}>
              <RiderDashboard user={user} />
            </PrivateRoute>
          }
        />

        {/* Driver Dashboard (protected) */}
        <Route
          path="/driver"
          element={
            <PrivateRoute user={user}>
              <DriverDashboard user={user} />
            </PrivateRoute>
          }
        />

        {/* Ride Status page (protected) */}
        <Route
          path="/ride/:rideId"
          element={
            <PrivateRoute user={user}>
              <RideStatus user={user} />
            </PrivateRoute>
          }
        />

        {/* Catch‐all → Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
