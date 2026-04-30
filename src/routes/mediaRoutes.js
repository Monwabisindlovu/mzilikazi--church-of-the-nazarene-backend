const express = require('express');
const router = express.Router();

const {
  getMedia,
  uploadNewMedia,
  updateMedia,
  deleteMediaById,
} = require('../controllers/mediaController');

const { protect } = require('../middleware/authMiddleware');

router.get('/', getMedia);
router.post('/', protect, uploadNewMedia);
router.put('/:id', protect, updateMedia);
router.delete('/:id', protect, deleteMediaById);

module.exports = router;
