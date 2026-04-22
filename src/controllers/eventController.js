const Event = require('../models/Event');

/* ================= GET ================= */
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPublic: true })
      .sort({ date: -1 })
      .populate('createdBy', 'name email');

    // Normalize fields for frontend
    const formatted = events.map(event => ({
      ...event.toObject(),
      is_featured: event.isFeatured, // frontend expects is_featured
      start_time: event.startTime,
      end_time: event.endTime,
      image: event.image || '', // ensure field exists
      contact_info: event.contactInfo || '',
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

/* ================= CREATE ================= */
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      start_time,
      end_time,
      location,
      venue,
      is_featured,
      image,
      contact_info,
    } = req.body;

    if (!title || !description || !date || !location) {
      return res
        .status(400)
        .json({ message: 'Title, description, date, and location are required' });
    }

    const publicId = image ? image.split('/').slice(-1)[0].split('.')[0] : null;

    const event = new Event({
      title,
      description,
      category: category || 'Other',
      date,
      startTime: start_time,
      endTime: end_time,
      location,
      venue,
      isFeatured: is_featured || false,
      image: image || '',
      contactInfo: contact_info || '',
      createdBy: req.user._id,
      publicId,
    });

    await event.save();

    // Normalize response for frontend
    const formatted = {
      ...event.toObject(),
      is_featured: event.isFeatured,
      start_time: event.startTime,
      end_time: event.endTime,
      image: event.image || '',
      contact_info: event.contactInfo || '',
    };

    res.status(201).json(formatted);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

/* ================= UPDATE ================= */
const updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      start_time,
      end_time,
      location,
      venue,
      is_featured,
      image,
      contact_info,
    } = req.body;

    const data = {
      title,
      description,
      category,
      date,
      startTime: start_time,
      endTime: end_time,
      location,
      venue,
      isFeatured: is_featured,
      image,
      contactInfo: contact_info,
      updatedBy: req.user._id,
    };

    const event = await Event.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const formatted = {
      ...event.toObject(),
      is_featured: event.isFeatured,
      start_time: event.startTime,
      end_time: event.endTime,
      image: event.image || '',
      contact_info: event.contactInfo || '',
    };

    res.json(formatted);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
};

/* ================= DELETE ================= */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Optional: delete from Cloudinary if image exists
    if (event.image && event.publicId) {
      const { deleteMedia } = require('../services/cloudinaryService');
      await deleteMedia(event.publicId);
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
