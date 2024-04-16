const { NlpManager } = require('node-nlp');
const fs = require('fs');
const path = require('path');
const requireDirectory = require('require-directory');

const modelPath = path.join(__dirname, '../model/model.nlp');
const manager = new NlpManager({ languages: ['en'] });

if (fs.existsSync(modelPath)) {
    manager.load(modelPath);
    console.log('NLP model loaded successfully.');
} else {
    console.error('NLP model not found, please train and save the model first.');
    process.exit(1); // Exit if no model is available
}

// Define actions for each intent
const actions = requireDirectory(module, '../actions');

module.exports = async (req, res, next) => {
    if (req.body && req.body.content) {
        try{
            const response = await manager.process('en', req.body.content);
            req.nlp = response;
            const appName = 'my-app';

            // Check if the intent has a corresponding action and the score is above a threshold
            if (actions[response.intent] && response.score > 0.9) {
                res.setHeader('Access-Control-Expose-Headers', 'X-Intent, X-Command');
                actions[response.intent](req, res, appName);
            } else {
                next();
            }
        } catch (error){
            console.error('Error processing NLP:', error);
            next();
        }
    }
};