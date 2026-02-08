const { GoogleGenerativeAI} = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyC0r9i88EVwzQL5T-py52ycE4F-4I02M_o');

async function listModels() {
  try {
    console.log('📋 Listing available models...\n');
    
    const models = await genAI.listModels();
    
    for await (const model of models) {
      console.log(`Model: ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
      console.log('');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
