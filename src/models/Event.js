const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    // Category supports any string
    category: { type: String, required: true, default: 'Other' },

    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    location: { type: String, required: true },
    venue: { type: String },

    // Media support
    image: { type: String }, // Cloudinary URL
    publicId: { type: String }, // Cloudinary public ID
    video: { type: String },
    videoThumbnail: { type: String },

    // Contact info for the event
    contactInfo: { type: String },

    // Status and visibility
    isFeatured: { type: Boolean, default: false }, // frontend expects is_featured
    isPublic: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled', 'postponed'],
      default: 'upcoming',
    },

    // Registration (optional)
    requiresRegistration: { type: Boolean, default: false },
    maxAttendees: { type: Number },
    registeredAttendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Analytics
    viewCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ isFeatured: 1, isPublic: 1, date: 1 });
eventSchema.index({ category: 1, date: 1 });

module.exports = mongoose.model('Event', eventSchema);
