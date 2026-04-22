const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file to Cloudinary
 */
const uploadMedia = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, options);
    return result;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload media');
  }
};

/**
 * Deletes a file from Cloudinary (image OR video)
 */
const deleteMedia = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType, // 🔥 IMPORTANT
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
