// Test if API key is valid
const fetch = require('node-fetch');

const API_KEY = 'AIzaSyC0r9i88EVwzQL5T-py52ycE4F-4I02M_o';

async function testAPIKey() {
  console.log('🔑 Testing API key...\n');
  
  try {
    // Try v1 API
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;
    console.log('Trying v1 API:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API key is valid!\n');
      console.log('Available models:');
      data.models?.forEach(model => {
        console.log(`  - ${model.name}`);
      });
    } else {
      console.log('❌ API Error:');
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPIKey();
