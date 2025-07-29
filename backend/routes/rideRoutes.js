const express =require('express');
const Ride =require('../models/Ride');
const router =express.Router();
//last momomet code
const verifyToken = require('../middleware/auth');

// Get ride status by ride ID
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


router.post('/request',async(req,res) => {
    const {
        rider,
        pickup,
        dropoff
    } =req.body;
    const ride =new Ride(
        {
            rider,
            pickup,
            dropoff
        }
    );
    await ride.save();
    res.json(ride);
});

router.post('/accept/:rideId',async(req,res) => {
    const {
        driver
    } =req.body;
    const ride =await Ride.findByIdAndUpdate(req.params.rideId,
        {
            driver,
            status:'accepted'
        },
        {
            new :true
        }
    );
    res.json(ride);
});
// Inside your rideRoutes.js
const verifyToken = require('../middleware/auth');

router.get('/pending', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'requested' }).populate('rider', 'name');
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/driver/:driverId', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.params.driverId })
      .populate('rider', 'name');
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports =router;
const express = require('express');
const Ride = require('../models/Ride');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Dummy estimateDistance function, please replace with real distance calculation or API call
const estimateDistance = (pickup, dropoff) => {
  // For example purposes, returning a fixed number
  return 10; // distance in km
};

const calculateFare = (pickup, dropoff, carType, numPeople) => {
  // Example: basic fare + per km + car type + extra per person
  let baseFare = 50;
  let km = estimateDistance(pickup, dropoff);
  let perKmRate = carType === 'suv' ? 20 : carType === 'minivan' ? 18 : 15;
  let personCharge = (numPeople > 4) ? (numPeople - 4) * 10 : 0;
  return baseFare + km * perKmRate + personCharge;
};

// Get ride status by ride ID
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

// Request a new ride with fare calculation
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
      status: 'requested'
    });
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept a ride by driver
router.post('/accept/:rideId', async (req, res) => {
  try {
    const { driver } = req.body;
    const ride = await Ride.findByIdAndUpdate(
      req.params.rideId,
      {
        driver,
        status: 'accepted'
      },
      { new: true }
    );
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all pending (requested) rides - protected
router.get('/pending', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'requested' })
      .populate('rider', 'name');
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all rides for a specific driver - protected
router.get('/driver/:driverId', verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.params.driverId })
      .populate('rider', 'name');
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
