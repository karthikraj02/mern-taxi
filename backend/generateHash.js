const bcrypt = require('bcryptjs');

bcrypt.hash('testpass', 10, function(err, hash) {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed password:', hash);
});
