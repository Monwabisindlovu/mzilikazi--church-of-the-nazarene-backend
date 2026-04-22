const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Ensure uploads folder exists (prevents ENOENT crashes)
 */
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Storage config
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.fieldname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${safeName}${ext}`);
  },
});

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
 * Multer instance
 */
const upload = multer({
  storage,
  fileFilter,

  // optional safety limits
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
