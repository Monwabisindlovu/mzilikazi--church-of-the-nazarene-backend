const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    type: {
      type: String,
      enum: ['image', 'video', 'audio'],
      required: true,
    },

    // Cloudinary data
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    thumbnail: { type: String },
    duration: { type: Number },

    category: {
      type: String,
      default: 'Other',
      trim: true,
    },

    album: { type: String },
    tags: [{ type: String }],

    isFeatured: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: true },

    fileSize: { type: Number },
    format: { type: String },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);
