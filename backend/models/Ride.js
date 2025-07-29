const mongoose = require('mongoose');

const CoordinatesSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
}, { _id: false });

const RideSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    pickup: {
      type: String,
      required: true,
    },
    pickupCoordinates: {
      type: CoordinatesSchema,
      required: true,
    },
    dropoff: {
      type: String,
      required: true,
    },
    dropoffCoordinates: {
      type: CoordinatesSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'completed'],
      default: 'requested',
    },
    numPeople: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    carType: {
      type: String,
      enum: ['sedan', 'suv', 'minivan'],
      default: 'sedan',
    },
    fare: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true, // optional, for tracking creation/update time
  }
);

module.exports = mongoose.model('Ride', RideSchema);
