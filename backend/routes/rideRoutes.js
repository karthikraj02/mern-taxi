const express = require('express');
const Ride = require('../models/Ride');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// Dummy estimateDistance function (replace with real implementation if available)
const estimateDistance = (pickup, dropoff) => {
  // For example, fixed value for demo
  return 10; // distance in kilometers
};

// Calculate fare based on distance, car type, and number of people
const calculateFare = (pickup, dropoff, carType, numPeople) => {
  const baseFare = 50;
  const km = estimateDistance(pickup, dropoff);
  const perKmRate = carType === 'suv' ? 20 : carType === 'minivan' ? 18 : 15;
  const extraPersonCharge = numPeople > 4 ? (numPeople - 4) * 10 : 0;
  return baseFare + km * perKmRate + extraPersonCharge;
};

// Route: Get ride status by ride ID
router.get('/status/:rideId', verifyToken, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate('rider', 'name')
      .populate('driver', 'name');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    res.json({ status: ride.status, ride });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route: Request a new ride with fare calculation
router.post('/request', async (req, res) => {
  try {
    const { rider, pickup, dropoff, numPeople = 1, carType = 'sedan' } = req.body;
    const fare = calculateFare(pickup, dropoff, carType, numPeople);

    const ride = new Ride({
      rider,
      pickup,
      dropoff,
      numPeople,
      carType,
      fare,
      status: 'requested',
    });

    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route: Accept a ride by driver
router.post('/accept/:rideId', async (req, res) => {
  try {
    const { driver } = req.body;
    const ride = await Ride.findByIdAndUpdate(
      req.params.rideId,
      {
        driver,
        status: 'accepted',
      },
      { new: true }
    );
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route: Get all pending (requested) rides - protected route
router.get('/pending', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'requested' }).populate('rider', 'name');
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route: Get all rides for a specific driver - protected route
router.get('/driver/:driverId', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.params.driverId }).populate('rider', 'name');
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
