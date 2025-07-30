// src/api/rideService.js
import apiClient from './apiClient';

/**
 * Helper to add Authorization header if token provided.
 */
const authHeader = (token) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Request a new ride
 * @param {Object} rideData - ride details
 * @param {string} token - JWT token (optional if apiClient handles it)
 */
export const requestRide = (rideData, token) => {
  return apiClient.post('/rides/request', rideData, {
    headers: {
      ...authHeader(token),
    },
  });
};

/**
 * Accept a ride by driver
 * @param {string} rideId
 * @param {string} driverId
 * @param {string} token - JWT token (optional)
 */
export const acceptRide = (rideId, driverId, token) => {
  return apiClient.post(
    `/rides/accept/${rideId}`,
    { driver: driverId },
    {
      headers: {
        ...authHeader(token),
      },
    }
  );
};

/**
 * Fetch all pending rides (admin/driver view)
 * @param {string} token - JWT token (optional)
 */
export const fetchPendingRides = (token) => {
  return apiClient.get('/rides/pending', {
    headers: {
      ...authHeader(token),
    },
  });
};

/**
 * Fetch rides assigned to a driver
 * @param {string} driverId
 * @param {string} token - JWT token (optional)
 */
export const fetchDriverRides = (driverId, token) => {
  return apiClient.get(`/rides/driver/${driverId}`, {
    headers: {
      ...authHeader(token),
    },
  });
};

/**
 * Fetch ride status by rideId
 * @param {string} rideId
 * @param {string} token - JWT token (optional)
 */
export const fetchRideStatus = (rideId, token) => {
  // Confirm with backend if endpoint should be `/rides/${rideId}` or `/rides/status/${rideId}`
  return apiClient.get(`/rides/${rideId}`, {
    headers: {
      ...authHeader(token),
    },
  });
};
