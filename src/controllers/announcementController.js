const Announcement = require('../models/Announcement');

/* ================= GET ================= */
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({
      isFeatured: -1,
      priority: -1,
      displayOrder: 1,
    });

    // ✅ NORMALIZE FOR FRONTEND
    const formatted = announcements.map(item => {
      const media = item.media?.[0];

      return {
        ...item.toObject(),

        // 🔥 CORE FIX
        image_url: media?.type === 'image' ? media.url : null,
        video_url: media?.type === 'video' ? media.url : null,

        // keep these for admin compatibility
        url: media?.url || null,
        media_type: media?.type || 'image',

        // naming
        link_url: item.linkUrl,
        link_text: item.linkText,
        display_order: item.displayOrder,
        is_active: item.isActive,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching announcements', error });
  }
};

/* ================= CREATE ================= */
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, media_type, url, link_url, link_text, display_order, is_active } =
      req.body;

    const announcement = new Announcement({
      title,
      content,

      // ✅ FIX: SAVE MEDIA CORRECTLY
      media: url
        ? [
            {
              url,
              type: media_type || 'image',
            },
          ]
        : [],

      // ✅ FIX NAMING
      linkUrl: link_url,
      linkText: link_text,
      displayOrder: display_order || 0,
      isActive: is_active ?? true,

      createdBy: req.user._id,
    });

    await announcement.save();

    res.status(201).json(announcement);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating announcement', error });
  }
};

/* ================= UPDATE ================= */
const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, media_type, url, link_url, link_text, display_order, is_active } =
      req.body;

    const updateData = {
      title,
      content,
      linkUrl: link_url,
      linkText: link_text,
      displayOrder: display_order,
      isActive: is_active,
      updatedBy: req.user._id,
    };

    // ✅ FIX: UPDATE MEDIA PROPERLY
    if (url) {
      updateData.media = [
        {
          url,
          type: media_type || 'image',
        },
      ];
    }

    const announcement = await Announcement.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!announcement) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error updating announcement', error });
  }
};

/* ================= DELETE ================= */
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting announcement', error });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
