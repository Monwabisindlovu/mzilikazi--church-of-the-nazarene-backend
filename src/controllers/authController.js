// src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isActive: true });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Update last login timestamp
    await user.updateLastLogin();

    const token = generateToken(user);

    res.json({ token, user: user.toSafeObject() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed', error });
  }
};

// Register (optional)
const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    const user = new User({
      email,
      password,
      name,
      role,
      createdBy: req.user?._id,
    });

    await user.save();

    res.status(201).json(user.toSafeObject());
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Registration failed', error });
  }
};

module.exports = {
  login,
  register,
};
