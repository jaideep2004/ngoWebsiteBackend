require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const postRoutes = require('./routes/posts');
const errorMiddleware = require('./middleware/errorMiddleware');

// Load environment variables
const cloudinary = require('./config/cloudinary');

// Test if Cloudinary is configured properly
console.log('Cloudinary Config Test:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key,
  api_secret: cloudinary.config().api_secret,
});

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test route to check backend status
app.get('/', (req, res) => {
  res.send('BACKEND');
  console.log('GET / - Backend status checked');
});

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  username: "admin", 
  password: "admin123"
};

// Admin login route
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  console.log(`POST /api/auth/login - Attempting login for username: ${username}`);

  // Validate credentials
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    console.log('POST /api/auth/login - Login successful');
    return res.status(200).json({ message: 'Login successful', isLoggedIn: true });
  } else {
    console.log('POST /api/auth/login - Invalid credentials');
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Use routes for posts
app.use('/api/posts', postRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
