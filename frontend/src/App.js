// /frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import RiderDashboard from './pages/RiderDashboard';
import DriverDashboard from './pages/DriverDashboard';
import RideStatus from './pages/RideStatus';

function App() {
  // Initialize user from localStorage to persist login across refreshes
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Sync user state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Also clear token on logout
    }
  }, [user]);

  // Protected route wrapper component
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/rider"
          element={
            <PrivateRoute>
              <RiderDashboard user={user} />
            </PrivateRoute>
          }
        />

        <Route
          path="/driver"
          element={
            <PrivateRoute>
              <DriverDashboard user={user} />
            </PrivateRoute>
          }
        />

        <Route
          path="/ride/:rideId"
          element={
            <PrivateRoute>
              <RideStatus />
            </PrivateRoute>
          }
        />

        {/* Redirect any unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
