const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Decoded token userId:', decoded.userId);
    
    const user = await User.findById(decoded.userId);
    console.log('Auth middleware - User found:', user ? 'Yes' : 'No');
    console.log('Auth middleware - User is_active:', user?.is_active);

    if (!user || !user.is_active) {
      console.log('Auth middleware - User not found or not active');
      return res.status(401).json({ error: 'Invalid token or user not found.' });
    }

    req.user = user;
    console.log('Auth middleware - Authentication successful for user:', user.username);
    next();
  } catch (error) {
    console.log('Auth middleware - Error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    res.status(500).json({ error: 'Authentication error.' });
  }
};

module.exports = auth; 