// backend/server.js (or app.js)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');
//auth
const registerRoute = require('./routes/auth/register');

//auth
const loginRoute = require('./routes/auth/login');





const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

app.use('/api/auth/register', registerRoute);
app.use('/api/auth/login', loginRoute);
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/taxiapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

console.log('Mongoose connection DB name:', mongoose.connection.name);


console.log('Connected to DB:', mongoose.connection.name);

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
