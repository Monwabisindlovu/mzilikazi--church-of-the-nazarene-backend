// src/models/Announcement.js
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['text', 'image', 'video', 'mixed'],
    default: 'text'
  },
  media: [{
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    thumbnail: { type: String } // For videos
  }],
  linkUrl: { type: String },
  linkText: { type: String, default: 'Learn More' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }, // For hero section
  priority: { type: Number, default: 0 }, // Higher = more prominent
  displayOrder: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient querying
announcementSchema.index({ isActive: 1, priority: -1, displayOrder: 1 });
announcementSchema.index({ isFeatured: 1, isActive: 1 });

module.exports = mongoose.model('Announcement', announcementSchema);