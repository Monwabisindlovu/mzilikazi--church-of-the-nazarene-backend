const mongoose = require('mongoose');

const leaderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
    },

    // Dynamic ministry: no enum, any string can be used
    ministry: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
    },

    photo: {
      type: String, // Cloudinary URL
    },

    email: {
      type: String,
    },

    phone: {
      type: String,
    },
    is_pastor: {
      type: Boolean,
      default: false,
    },

    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      youtube: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

leaderSchema.index({ ministry: 1, displayOrder: 1 });

module.exports = mongoose.model('Leader', leaderSchema);
