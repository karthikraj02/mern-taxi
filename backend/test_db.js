const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import your User model (adjust path as needed)
const User = require('./models/User');

// Replace with your test database URI if you want to keep tests separate
const MONGO_URI = 'mongodb://localhost:27017/test_taxiapp';

async function testDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected!');

    // Create sample user data
    const password = 'testpassword';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delete if user already exists (to avoid duplicate keys on rerun)
    await User.deleteOne({ email: 'testuser@example.com' });

    // Insert test user
    const newUser = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword,
      role: 'rider',
    });

    await newUser.save();
    console.log('Test user inserted:', newUser);

    // Fetch user back to verify insertion
    const user = await User.findOne({ email: 'testuser@example.com' });
    console.log('Fetched user:', user);

    // Close connection
    await mongoose.disconnect();
    console.log('MongoDB disconnected!');
  } catch (err) {
    console.error('DB test error:', err);
    process.exit(1);
  }
}

testDB();
