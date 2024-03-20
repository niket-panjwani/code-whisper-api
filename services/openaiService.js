// Load environment variables from .env file into process.env
require('dotenv').config();
// Import the OpenAI library
const OpenAI = require('openai');
// Initialize a new OpenAI instance with your API key
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });
// Import the fetchThreadByUserid function from the dbService module
const { fetchThreadByUserid } = require('./dbService');

// Export an asynchronous function called processMessage
exports.processMessage = async (content, res) => {
  try {
    // Fetch Assistant ID from environment variables
    const assistantId = process.env.OPEN_AI_ASSISTANT_ID;

    //Fetch threadId from the database
    const threadId = await fetchThreadByUserid('niket-panjwani');

    // Check if threadId exists and is valid; if not, create a new thread
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id; // Save the thread ID for future use
    }

    // Send a message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: content
    });

    // Start a run in the thread and stream the results
    const run = openai.beta.threads.runs.createAndStream(threadId, {
      assistant_id: assistantId
    });

    // Handle the different events that can occur during the run
    run
      .on('textCreated', (text) => res.write('')) // When text is created, write it to the response
      .on('textDelta', (textDelta, snapshot) => res.write(textDelta.value)) // When a text delta occurs, write it to the response
      .on('toolCallCreated', (toolCall) => res.write(`\n${toolCall.type}\n\n`)) // When a tool call is created, write it to the response
      .on('toolCallDelta', (toolCallDelta, snapshot) => { // When a tool call delta occurs, handle it
        if (toolCallDelta.type === 'code_interpreter') { // If the tool call delta is from a code interpreter
          if (toolCallDelta.code_interpreter.input) { // If there is input, write it to the response
            res.write(toolCallDelta.code_interpreter.input);
          }
          if (toolCallDelta.code_interpreter.outputs) { // If there are outputs, write them to the response
            res.write("\noutput >\n");
            toolCallDelta.code_interpreter.outputs.forEach(output => {
              if (output.type === "logs") { // If the output is logs, write them to the response
                res.write(`\n${output.logs}\n`);
              }
            });
          }
        }
      })
      .on('end', () => res.end()) // When the run ends, end the response
      .on('error', (error) => { // When an error occurs, handle it
        console.error(error); // Log the error
        if (!res.headersSent) { // If headers have not been sent, send a 500 status code and an error message
          res.status(500).send('An error occurred');
        } else { // If headers have been sent, end the response
          if (!res.writableEnded) {
            res.end();
          }
        }
      });

  } catch (error) { // If an error occurs, log it and send a 500 status code and an error message
    console.error(error);
    res.status(500).send('An error occurred');
  };
}