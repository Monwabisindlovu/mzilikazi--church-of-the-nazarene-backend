const mongoose = require('mongoose');

const partnershipInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    organization: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    phone: {
      type: String,
    },

    // Dynamic partnership type
    partnershipType: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    // Dynamic status
    status: {
      type: String,
      required: true,
      default: 'new', // optional default, can be managed via admin
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

partnershipInquirySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('PartnershipInquiry', partnershipInquirySchema);
