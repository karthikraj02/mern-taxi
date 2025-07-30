const express = require('express');
const router = express.Router();
const User = require('../../models/User');  // Adjust path if needed
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
  console.log('Register API HIT:', req.body);

  try {
    let { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    email = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });
    console.log('existingUser:', existingUser);

    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email,
      password: hashedPassword,
      role: role.trim().toLowerCase()
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
