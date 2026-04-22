const PartnershipInquiry = require('../models/PartnershipInquiry');
const { sendEmail } = require('../services/emailService');

// Get all inquiries
const getInquiries = async (req, res) => {
  try {
    const inquiries = await PartnershipInquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries', error });
  }
};

// Create new inquiry
const createInquiry = async (req, res) => {
  try {
    const inquiry = new PartnershipInquiry(req.body);
    await inquiry.save();

    // Optional: notify admin via email
    await sendEmail(
      process.env.ADMIN_EMAIL,
      'New Partnership Inquiry',
      `<p>New inquiry from ${inquiry.name} (${inquiry.email})</p><p>Message: ${inquiry.message}</p>`
    );

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: 'Error creating inquiry', error });
  }
};

// Update inquiry (status, notes, assignedTo)
const updateInquiry = async (req, res) => {
  try {
    const inquiry = await PartnershipInquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!inquiry) return res.status(404).json({ message: 'Not found' });
    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ message: 'Error updating inquiry', error });
  }
};

// Delete inquiry
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await PartnershipInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inquiry', error });
  }
};

module.exports = {
  getInquiries,
  createInquiry,
  updateInquiry,
  deleteInquiry,
};
