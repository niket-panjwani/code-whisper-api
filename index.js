// Load environment variables from .env file into process.env
require('dotenv').config();

// Import the Express application from app.js
const app = require('./app');

// Set the port to the value in the environment variable PORT, or 3000 if PORT is not set
const port = process.env.PORT || 3000;

// Start the Express application, listening for requests on the specified port
app.listen(port, () => {
  // Log a message to the console once the server starts successfully
  console.log(`App listening at http://localhost:${port}`);
});