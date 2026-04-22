const Livestream = require('../models/Livestream');

// GET active livestream
const getActiveLivestream = async (req, res) => {
  try {
    const livestream = await Livestream.findOne({ isActive: true });
    if (!livestream) {
      return res.status(404).json({ message: 'No active livestream found' });
    }
    res.json(livestream);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new livestream (admin only)
const createLivestream = async (req, res) => {
  try {
    // If this livestream is set to active, deactivate others
    if (req.body.isActive) {
      await Livestream.updateMany({}, { isActive: false });
    }

    const livestream = await Livestream.create(req.body);
    res.status(201).json(livestream);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH to update livestream (activate/deactivate, edit)
const updateLivestream = async (req, res) => {
  try {
    const livestream = await Livestream.findById(req.params.id);
    if (!livestream) return res.status(404).json({ message: 'Livestream not found' });

    if (req.body.isActive) {
      await Livestream.updateMany({}, { isActive: false });
    }

    Object.assign(livestream, req.body);
    await livestream.save();

    res.json(livestream);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE livestream
const deleteLivestream = async (req, res) => {
  try {
    const livestream = await Livestream.findByIdAndDelete(req.params.id);
    if (!livestream) return res.status(404).json({ message: 'Livestream not found' });

    res.json({ message: 'Livestream deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export all functions
module.exports = {
  getActiveLivestream,
  createLivestream,
  updateLivestream,
  deleteLivestream,
};
