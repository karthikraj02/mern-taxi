// routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if needed

const router = express.Router();

const JWT_SECRET = 'your_jwt_secret_key';  // Replace with env var in production

// Simple email validation regex helper
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// User registration
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Please provide name, email, password, and role' });
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    role = role.trim().toLowerCase();

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!['rider', 'driver'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either rider or driver' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    console.log('Login req.body:', req.body);

    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const email = req.body.email.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user);

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare password using bcrypt.compare (as callback, per your snippet)
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) {
        console.error('bcrypt compare error:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      console.log('Password match:', isMatch);

      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Password matched - generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
        },
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
