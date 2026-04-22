// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'media_manager', 'secretary', 'viewer'],
      default: 'viewer',
    },
    permissions: [
      {
        type: String,
        enum: [
          'events.create',
          'events.edit',
          'events.delete',
          'media.create',
          'media.edit',
          'media.delete',
          'announcements.create',
          'announcements.edit',
          'announcements.delete',
          'leaders.create',
          'leaders.edit',
          'leaders.delete',
          'live_stream.manage',
          'users.create',
          'users.edit',
          'users.delete',
          'partnership.view',
          'partnership.manage',
        ],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastLogin: {
      type: Date,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

// Predefined permissions for each role
const rolePermissions = {
  super_admin: ['*'],
  admin: [
    'events.create',
    'events.edit',
    'events.delete',
    'media.create',
    'media.edit',
    'media.delete',
    'announcements.create',
    'announcements.edit',
    'announcements.delete',
    'leaders.create',
    'leaders.edit',
    'leaders.delete',
    'live_stream.manage',
    'users.create',
    'users.edit',
    'partnership.view',
    'partnership.manage',
  ],
  media_manager: [
    'media.create',
    'media.edit',
    'media.delete',
    'announcements.create',
    'announcements.edit',
    'announcements.delete',
    'events.edit',
  ],
  secretary: [
    'events.create',
    'events.edit',
    'announcements.create',
    'announcements.edit',
    'leaders.create',
    'leaders.edit',
    'partnership.view',
  ],
  viewer: ['partnership.view'],
};

// Pre-save hook: hash password if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Strip sensitive fields for safe API responses
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Check if user has a specific permission
userSchema.methods.hasPermission = function (permission) {
  if (this.role === 'super_admin') return true;
  return this.getEffectivePermissions().includes(permission);
};

// Get effective permissions
userSchema.methods.getEffectivePermissions = function () {
  if (this.role === 'super_admin') return ['*'];
  return this.permissions && this.permissions.length > 0
    ? this.permissions
    : rolePermissions[this.role] || [];
};

// Update last login timestamp
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
