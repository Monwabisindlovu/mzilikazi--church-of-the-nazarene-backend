const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// ===============================
// Upload Image to Cloudinary
// ===============================
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No image file provided',
      });
    }

    let uploadSource;

    // ✅ Handle memoryStorage (buffer)
    if (req.file.buffer) {
      const base64 = req.file.buffer.toString('base64');
      uploadSource = `data:${req.file.mimetype};base64,${base64}`;
    }

    // ✅ Handle diskStorage (file path)
    else if (req.file.path) {
      uploadSource = req.file.path;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(uploadSource, {
      folder: 'mvee/products',
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    // 🧹 Delete local file if diskStorage used
    if (req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(201).json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error('Cloudinary upload failed:', error);

    return res.status(500).json({
      message: 'Image upload failed',
    });
  }
};

// ===============================
// Generate Cloudinary Signature
// ===============================
const getSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'products' },
      process.env.CLOUDINARY_API_SECRET
    );

    return res.status(200).json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error('Signature generation failed:', error);

    return res.status(500).json({
      message: 'Failed to generate signature',
    });
  }
};

// ===============================
module.exports = {
  uploadImage,
  getSignature,
};
