const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to get events
router.get('/', getEvents);

// Admin routes
router.post('/', protect, authorize('events.create'), createEvent);
router.put('/:id', protect, authorize('events.edit'), updateEvent);
router.delete('/:id', protect, authorize('events.delete'), deleteEvent);

module.exports = router;
