const express = require('express');
const router = express.Router();
const {
  getAllLeaders,
  getLeaderById,
  createLeader,
  updateLeader,
  deleteLeader,
} = require('../controllers/leaderController');
const { protect } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getAllLeaders);
router.get('/:id', getLeaderById);

// Protected routes (admin only) with single photo upload
router.post('/', protect, uploadSingle('photo'), createLeader);
router.put('/:id', protect, uploadSingle('photo'), updateLeader);
router.delete('/:id', protect, deleteLeader);

module.exports = router;
