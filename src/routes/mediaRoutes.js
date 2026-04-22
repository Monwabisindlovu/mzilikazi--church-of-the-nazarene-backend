const express = require('express');
const router = express.Router();
const { getMedia, uploadNewMedia, deleteMediaById } = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.get('/', getMedia);

// Admin
router.post('/', protect, uploadNewMedia); // ✅ NO multer
router.delete('/:id', protect, deleteMediaById);

module.exports = router;
