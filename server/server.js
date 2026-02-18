require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', imageRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});