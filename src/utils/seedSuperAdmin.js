// src/utils/seedSuperAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User'); // go up one level to models
const connectDB = require('../config/db'); // go up one level to config

const seedSuperAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env');
      process.exit(1);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Super admin already exists.');
      process.exit(0);
    }

    // ⚠️ Save plain password — pre-save hook in User model will hash it
    const superAdmin = new User({
      email,
      password,
      name: 'Super Admin',
      role: 'super_admin',
      isActive: true,
    });

    await superAdmin.save();
    console.log('Super admin created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating super admin:', err);
    process.exit(1);
  }
};

seedSuperAdmin();
