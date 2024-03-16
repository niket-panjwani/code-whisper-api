// Import the required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const messageRoutes = require('./routes/messageRoutes');
const errorHandler = require('./middlewares/errorHandler');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Initialize an Express application
const app = express();

// Set the base url for swagger
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

// Initialize Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Specifies the OpenAPI version
    info: {
      title: 'Customer API',
      version: '1.0.0', // Don't forget to include the version
      description: 'Customer API Information',
      contact: {
        name: 'Amazing Developer',
      },
    },
    servers: [
      {
        url: `${baseUrl}`,
      },
    ],
  },
  apis: ['./routes/*.js'], // Assumes your routes are in the routes directory and have a .js extension
};

// Initialize Swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use bodyParser middleware to parse JSON bodies
app.use(bodyParser.json());

// Use cors middleware to enable Cross Origin Resource Sharing
app.use(cors());

// Use messageRoutes for any routes that start with '/api'
app.use('', messageRoutes);

// Use errorHandler middleware for handling errors
app.use(errorHandler);

// Export the app module
module.exports = app;