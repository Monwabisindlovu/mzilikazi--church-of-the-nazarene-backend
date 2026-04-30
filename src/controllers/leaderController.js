const Leader = require('../models/Leader');
const cloudinaryService = require('../services/cloudinaryService');

// Get all leaders
exports.getAllLeaders = async (req, res) => {
  try {
    const leaders = await Leader.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single leader
exports.getLeaderById = async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);

    if (!leader) {
      return res.status(404).json({ message: 'Leader not found' });
    }

    res.json(leader);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE LEADER
exports.createLeader = async (req, res) => {
  try {
    const { name, title, ministry, bio, displayOrder, is_pastor } = req.body;

    let photoUrl = null;
    let photoPublicId = null;

    // Handle FILE upload
    if (req.file) {
      const uploadResult = await cloudinaryService.uploadImage(req.file.path, 'leaders');
      photoUrl = uploadResult.secure_url;
      photoPublicId = uploadResult.public_id;
    }
    // Handle URL
    else if (req.body.photo) {
      photoUrl = req.body.photo;
    }

    // ⭐ Ensure only one pastor exists
    if (is_pastor === 'true' || is_pastor === true) {
      await Leader.updateMany({ is_pastor: true }, { $set: { is_pastor: false } });
    }

    const leader = await Leader.create({
      name,
      title,
      ministry,
      bio,
      photo: photoUrl,
      photoPublicId,
      displayOrder: displayOrder || 0,
      is_pastor: is_pastor === 'true' || is_pastor === true,
    });

    res.status(201).json(leader);
  } catch (err) {
    console.error('CREATE LEADER ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE LEADER
exports.updateLeader = async (req, res) => {
  try {
    const { name, title, ministry, bio, displayOrder, is_pastor } = req.body;

    const leader = await Leader.findById(req.params.id);

    if (!leader) {
      return res.status(404).json({ message: 'Leader not found' });
    }

    // Handle FILE upload
    if (req.file) {
      if (leader.photoPublicId) {
        await cloudinaryService.deleteImage(leader.photoPublicId);
      }

      const uploadResult = await cloudinaryService.uploadImage(req.file.path, 'leaders');
      leader.photo = uploadResult.secure_url;
      leader.photoPublicId = uploadResult.public_id;
    }
    // Handle URL
    else if (req.body.photo) {
      leader.photo = req.body.photo;
    }

    // ⭐ Ensure only one pastor exists
    if (is_pastor === 'true' || is_pastor === true) {
      await Leader.updateMany({ is_pastor: true }, { $set: { is_pastor: false } });

      leader.is_pastor = true;
    } else if (is_pastor !== undefined) {
      leader.is_pastor = false;
    }

    // Update fields
    if (name) leader.name = name;
    if (title) leader.title = title;
    if (ministry) leader.ministry = ministry;
    if (bio) leader.bio = bio;
    if (displayOrder !== undefined) leader.displayOrder = displayOrder;

    await leader.save();
    res.json(leader);
  } catch (err) {
    console.error('UPDATE LEADER ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE LEADER
exports.deleteLeader = async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);

    if (!leader) {
      return res.status(404).json({ message: 'Leader not found' });
    }

    if (leader.photoPublicId) {
      await cloudinaryService.deleteImage(leader.photoPublicId);
    }

    await leader.deleteOne();

    res.json({ message: 'Leader deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
