const Media = require('../models/Media');
const { deleteMedia } = require('../services/cloudinaryService');

/* ================= GET ================= */
const getMedia = async (req, res) => {
  try {
    const media = await Media.find()
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name email');

    const formatted = media.map(item => {
      const obj = item.toObject();

      return {
        ...obj,

        // 🔥 SINGLE SOURCE OF TRUTH (IMPORTANT)
        url: obj.url,
        media_type: obj.type,

        // optional alias (safe for old code)
        type: obj.type,
        is_featured: obj.isFeatured,
      };
    });

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

    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);

    const media = new Media({
      title,
      description,

      type: isVideo ? 'video' : (media_type || 'image'),
      url,

      category: category || 'Other',
      isFeatured: is_featured ?? false,

      publicId: url.split('/').pop()?.split('.')[0],
      uploadedBy: req.user?._id,
    });

    await media.save();

    const formatted = {
      ...media.toObject(),

      url: media.url,
      media_type: media.type,
      type: media.type,
      is_featured: media.isFeatured,
    };

    res.status(201).json(formatted);
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ message: 'Error creating media' });
  }
};

/* ================= UPDATE ================= */
const updateMedia = async (req, res) => {
  try {
    const { title, description, media_type, category, is_featured, url } = req.body;

    const updateData = {
      title,
      description,
      category,
      isFeatured: is_featured,
    };

    if (url) {
      updateData.url = url;
      updateData.type = /\.(mp4|webm|ogg|mov)$/i.test(url)
        ? 'video'
        : (media_type || 'image');
    }

    const media = await Media.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    const formatted = {
      ...media.toObject(),

      url: media.url,
      media_type: media.type,
      type: media.type,
      is_featured: media.isFeatured,
    };

    res.json(formatted);
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({ message: 'Error updating media' });
  }
};

/* ================= DELETE ================= */
const deleteMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

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
  updateMedia,
  deleteMediaById,
};