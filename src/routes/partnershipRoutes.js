const express = require('express');
const router = express.Router();
const {
  getInquiries,
  createInquiry,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/partnershipController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to submit inquiry
router.post('/', createInquiry);

// Admin routes
router.get('/', protect, authorize('partnership.view'), getInquiries);
router.put('/:id', protect, authorize('partnership.manage'), updateInquiry);
router.delete('/:id', protect, authorize('partnership.manage'), deleteInquiry);

module.exports = router;
