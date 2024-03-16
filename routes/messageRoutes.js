// Import the required modules
const express = require('express');
// Create a new router object
const router = express.Router();
// Import the messageController
const messageController = require('../controllers/messageController');

// Define a route for POST requests to '/sendMessage'
// When this route is hit, the sendMessage function from the messageController will be executed
/**
 * @swagger
 * /api/sendMessage:
 *   post:
 *     summary: Send a message
 *     description: This endpoint sends a message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the message
 *     responses:
 *       200:
 *         description: The message was sent successfully
 *       500:
 *         description: There was an error sending the message
 */
router.post('/sendMessage', messageController.sendMessage);

// Export the router object so it can be used in other parts of the application
module.exports = router;