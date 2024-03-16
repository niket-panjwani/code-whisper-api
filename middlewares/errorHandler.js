// Export a middleware function
module.exports = (error, req, res, next) => {
  // Log the error to the console
  console.error(error);
  // Send a response with a 500 (Internal Server Error) status code and a message
  res.status(500).send('An error occurred');
};