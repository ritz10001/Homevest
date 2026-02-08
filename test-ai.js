// Simple test script to verify Gemini AI is working
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyC0r9i88EVwzQL5T-py52ycE4F-4I02M_o');

async function testAI() {
  console.log('🧪 Testing Gemini AI...');
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('✅ Model initialized');
    
    const result = await model.generateContent('Say hello in JSON format: {"message": "your message here"}');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Response received:');
    console.log(text);
    
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    
    console.log('✅ Parsed JSON:');
    console.log(parsed);
    
    console.log('\n🎉 Gemini AI is working!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAI();
