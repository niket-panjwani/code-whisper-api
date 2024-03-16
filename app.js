// Import the required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const messageRoutes = require('./routes/messageRoutes');
const errorHandler = require('./middlewares/errorHandler');

// Initialize an Express application
const app = express();

// Use bodyParser middleware to parse JSON bodies
app.use(bodyParser.json());

// Use cors middleware to enable Cross Origin Resource Sharing
app.use(cors());

// Use messageRoutes for any routes that start with '/api'
app.use('/api', messageRoutes);

// Use errorHandler middleware for handling errors
app.use(errorHandler);

// Export the app module
module.exports = app;