const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to get announcements
router.get('/', getAnnouncements);

// Admin routes
router.post('/', protect, authorize('announcements.create'), createAnnouncement);
router.put('/:id', protect, authorize('announcements.edit'), updateAnnouncement);
router.delete('/:id', protect, authorize('announcements.delete'), deleteAnnouncement);

module.exports = router;
