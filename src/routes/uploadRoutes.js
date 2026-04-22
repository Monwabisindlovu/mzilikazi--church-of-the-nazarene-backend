const express = require('express');
const router = express.Router();

const { upload } = require('../middleware/uploadMiddleware');
const { uploadImage, getSignature } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

router.post('/image', protect, upload.single('image'), uploadImage);
router.get('/signature', protect, getSignature);

module.exports = router;
