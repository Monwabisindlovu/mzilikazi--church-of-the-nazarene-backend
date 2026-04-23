const multer = require('multer');

/**
 * Allowed file types
 */
const allowedMimeTypes = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',

  // Videos
  'video/mp4',
  'video/quicktime',
  'video/webm',

  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/mp3',
];

/**
 * File filter
 */
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log('❌ Rejected file type:', file.mimetype);
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

/**
 * Use MEMORY storage (IMPORTANT for Render)
 */
const storage = multer.memoryStorage();

/**
 * Multer instance
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});

/**
 * Export helpers
 */
module.exports = {
  upload,
  uploadSingle: fieldName => upload.single(fieldName),
  uploadMultiple: (fieldName, maxCount = 10) => upload.array(fieldName, maxCount),
  uploadFields: fields => upload.fields(fields),
};
