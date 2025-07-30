const express = require('express');
const router = express.Router();
const User = require('../../models/User'); // Adjust path as needed
const bcrypt = require('bcryptjs');

// Simple email validation regex
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// POST /api/auth/register
router.post('/', async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    console.log('[DEBUG] Registration attempt:', { name, email, role });

    // Basic input validation and normalization
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
    console.log('[DEBUG] Existing user lookup result:', existingUser);

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
