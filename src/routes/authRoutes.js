const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);

// Optional: only admins can register new users
router.post('/register', protect, register);

// Protected route: get current logged-in user
router.get('/me', protect, (req, res) => {
  res.json(req.user); // req.user is set by protect middleware
});

module.exports = router;
