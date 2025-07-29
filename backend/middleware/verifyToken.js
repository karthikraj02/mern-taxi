const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';
//middleware
const verifyToken = require('../middleware/verifyToken');
router.get('/protected-route', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});


function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = verifyToken;
