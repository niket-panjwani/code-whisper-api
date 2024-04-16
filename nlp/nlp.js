const { NlpManager } = require('node-nlp');
const fs = require('fs');

const manager = new NlpManager({ languages: ['en'] });

// Load training data from file
const trainingData = JSON.parse(fs.readFileSync(`${__dirname}/trainingData.json`, 'utf8'));

// Add training data to NLP manager
for (const { intent, utterances } of trainingData) {
  for (const utterance of utterances) {
    manager.addDocument('en', utterance, intent);
  }
}

// Train and save the model
async function trainAndSave() {
  await manager.train();
  manager.save(`${__dirname}/../model/model.nlp`);
  console.log('Training complete and model saved.');
}

trainAndSave();