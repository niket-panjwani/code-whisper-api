// Import the openaiService module
const openaiService = require('../services/openaiService');

// Define an asynchronous function called sendMessage
exports.sendMessage = async (req, res, next) => {
  try {
    // Extract the 'content' property from the request body
    const content = req.body.content;

    // Extract the 'userid' property from the request body
    const user_id = req.body.user_id;
    // Call the processMessage function from the openaiService module
    // Pass the 'content' and the response object 'res' as arguments
    await openaiService.processMessage(content, res, user_id);
  } catch (error) {
    // If an error occurs, pass it to the next middleware function
    // In this case, it's the global error handler
    next(error);
  }
};