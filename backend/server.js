const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const friendRoutes = require('./routes/friendRoutes');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  credentials: true // Allow cookies to be sent with requests
}));

// MongoDB connection
const mongoURL = process.env.mongoURL;


if (!mongoURL) {
  console.error('MONGODB_URL is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(mongoURL, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// API Routes
app.use('/api', authRoutes);
app.use('/api/friends', authMiddleware, friendRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});