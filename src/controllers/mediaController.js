const Media = require('../models/Media');
const { deleteMedia } = require('../services/cloudinaryService');

/* ================= GET ================= */
const getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 }).populate('uploadedBy', 'name email');

    // Optional: normalize fields for frontend
    const formatted = media.map(item => ({
      ...item.toObject(),
      media_type: item.type, // frontend expects media_type
      is_featured: item.isFeatured, // frontend expects is_featured
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ message: 'Error fetching media' });
  }
};

/* ================= CREATE ================= */
const uploadNewMedia = async (req, res) => {
  try {
    const { title, description, media_type, category, is_featured, url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'url is required' });
    }

    const publicId = url.split('/').slice(-1)[0].split('.')[0];

    const media = new Media({
      title,
      description,

      // ✅ Match your model fields
      type: media_type || 'image',
      url: url,
      category: category || 'Other',
      isFeatured: is_featured || false, // ✅ camelCase
      publicId,
      uploadedBy: req.user?._id,
    });

    await media.save();

    // Normalize for frontend
    const formatted = {
      ...media.toObject(),
      media_type: media.type,
      is_featured: media.isFeatured,
    };

    res.status(201).json(formatted);
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ message: 'Error creating media' });
  }
};

/* ================= DELETE ================= */
const deleteMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });

    // Delete from Cloudinary if publicId exists
    if (media.publicId) {
      await deleteMedia(media.publicId);
    }

    await media.deleteOne();

    res.json({ message: 'Media deleted' });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ message: 'Error deleting media' });
  }
};

module.exports = {
  getMedia,
  uploadNewMedia,
  deleteMediaById,
};
