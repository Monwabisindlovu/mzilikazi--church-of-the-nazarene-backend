const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  getMe, // Add this
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/usersController');
const { protect, authorize } = require('../middleware/authMiddleware');

// IMPORTANT: /me must come BEFORE /:id
// Get current logged-in user profile
router.get('/me', protect, getMe);

// List all users
router.get('/', protect, authorize('users.view', 'users.manage'), getUsers);

// Get single user by ID (must come after /me)
router.get('/:id', protect, authorize('users.view', 'users.manage'), getUserById);

// Create new user
router.post('/', protect, authorize('users.create'), createUser);

// Update user
router.put('/:id', protect, authorize('users.edit'), updateUser);

// Delete user
router.delete('/:id', protect, authorize('users.delete'), deleteUser);

module.exports = router;
