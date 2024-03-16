// Import the required modules
const express = require('express');
// Create a new router object
const router = express.Router();
// Import the messageController
const messageController = require('../controllers/messageController');

// Define a route for POST requests to '/sendMessage'
// When this route is hit, the sendMessage function from the messageController will be executed
router.post('/sendMessage', messageController.sendMessage);

// Export the router object so it can be used in other parts of the application
module.exports = router;