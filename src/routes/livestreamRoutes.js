const express = require('express');
const router = express.Router();
const {
  getActiveLivestream,
  createLivestream,
  updateLivestream,
  deleteLivestream,
} = require('../controllers/livestreamController');

// Use protect middleware (not protectAdmin)
const { protect } = require('../middleware/authMiddleware');

// Public route: get current active livestream
router.get('/active', getActiveLivestream);

// Protected routes (any logged in user)
router.post('/', protect, createLivestream);
router.patch('/:id', protect, updateLivestream);
router.delete('/:id', protect, deleteLivestream);

module.exports = router;
