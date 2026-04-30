const cloudinary = require('../config/cloudinary');

/* ================= HELPERS ================= */
const detectResourceType = (filePath = '') => {
  if (filePath.match(/\.(mp4|webm|ogg)$/i)) return 'video';
  if (filePath.match(/\.(mp3|wav)$/i)) return 'video';
  return 'image';
};

/**
 * ================= UPLOAD =================
 * Supports image, video, audio automatically
 */
const uploadMedia = async (filePath, options = {}) => {
  try {
    const resourceType = detectResourceType(filePath);

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      folder: 'media',
      ...options,
    });

    // ✅ Normalize useful data for DB
    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      duration: result.duration,
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload media');
  }
};

/**
 * ================= DELETE =================
 * Works for image, video, audio
 */
const deleteMedia = async (publicId, resourceType = 'image') => {
  try {
    // ✅ Normalize (Cloudinary expects "video" for audio too)
    const normalizedType = resourceType === 'audio' ? 'video' : resourceType || 'image';

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: normalizedType,
    });

    return result;
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw new Error('Failed to delete media');
  }
};

module.exports = {
  uploadMedia,
  deleteMedia,
};
