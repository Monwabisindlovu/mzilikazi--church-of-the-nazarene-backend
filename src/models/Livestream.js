// src/models/Livestream.js
const mongoose = require('mongoose');

const livestreamSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Livestream', livestreamSchema);
