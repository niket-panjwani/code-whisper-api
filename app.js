require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const bodyParser = require('body-parser');

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

app.post('/sendMessage', async (req, res) => {
  try {
    const content = req.body.content;

    const assistant = await openai.beta.assistants.create({
      name: "Code Whisper",
      instructions: "You are a coding assistant. Answer all software engineering questions to the best of your ability.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-turbo-preview"
    });

    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: content
    });

    const run = openai.beta.threads.runs.createAndStream(thread.id, {
      assistant_id: assistant.id
    });

    run
      .on('textCreated', (text) => res.write(''))
      .on('textDelta', (textDelta, snapshot) => res.write(textDelta.value))
      .on('toolCallCreated', (toolCall) => res.write(`\n${toolCall.type}\n\n`))
      .on('toolCallDelta', (toolCallDelta, snapshot) => {
        if (toolCallDelta.type === 'code_interpreter') {
          if (toolCallDelta.code_interpreter.input) {
            res.write(toolCallDelta.code_interpreter.input);
          }
          if (toolCallDelta.code_interpreter.outputs) {
            res.write("\noutput >\n");
            toolCallDelta.code_interpreter.outputs.forEach(output => {
              if (output.type === "logs") {
                res.write(`\n${output.logs}\n`);
              }
            });
          }
        }
      })
      .on('end', () => res.end()) // End the response when the stream ends
      .on('error', (error) => {
        console.error(error);
        res.status(500).send('An error occurred');
      });

  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

