// src/api/rideService.js
import apiClient from './apiClient';

export const requestRide = (rideData) => {
  return apiClient.post('/rides/request', rideData);
};

export const acceptRide = (rideId, driverId) => {
  return apiClient.post(`/rides/accept/${rideId}`, { driver: driverId });
};

export const fetchPendingRides = () => {
  return apiClient.get('/rides/pending');
};

export const fetchDriverRides = (driverId) => {
  return apiClient.get(`/rides/driver/${driverId}`);
};

export const fetchRideStatus = (rideId) => {
  return apiClient.get(`/rides/status/${rideId}`);
};
