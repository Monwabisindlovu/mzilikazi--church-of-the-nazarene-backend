const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./src/middleware/errorMiddleware');

// Routes
const announcementRoutes = require('./src/routes/announcementRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const mediaRoutes = require('./src/routes/mediaRoutes');
const authRoutes = require('./src/routes/authRoutes');
const partnershipRoutes = require('./src/routes/partnershipRoutes');
const usersRoutes = require('./src/routes/users');
const leaderRoutes = require('./src/routes/leaderRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes'); // ✅ ADD THIS

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - ORDER MATTERS
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/leaders', leaderRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/partnership', partnershipRoutes);

// ✅ ADD THIS (this fixes your 404 on uploads)
app.use('/api/uploads', uploadRoutes);

// Livestream routes
try {
  const livestreamRoutes = require('./src/routes/livestreamRoutes');
  console.log('✅ Livestream routes loaded');
  app.use('/api/livestream', livestreamRoutes);
} catch (err) {
  console.error('❌ Failed to load livestream routes:', err.message);

  const Livestream = require('./src/models/Livestream');
  app.get('/api/livestream/active', async (req, res) => {
    try {
      const livestream = await Livestream.findOne({ isActive: true });
      if (!livestream) {
        return res.status(404).json({ message: 'No active livestream' });
      }
      res.json(livestream);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
}

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Church API is running' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
