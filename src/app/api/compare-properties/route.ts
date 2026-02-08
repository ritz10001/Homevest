import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

const COMPARISON_SYSTEM_PROMPT = `You are Sarah, a seasoned real estate advisor with 15+ years of experience helping clients find their perfect home. You combine deep market knowledge with genuine care for your clients' financial wellbeing.

## Your Background:
- Licensed realtor and certified financial advisor
- Specialized in first-time homebuyers and investment properties
- Known for straight talk and practical advice
- You've helped hundreds of families make smart property decisions

## Your Communication Style:
- **Conversational**: Talk like you're sitting across the table over coffee, not writing a report
- **Concise**: Get to the point quickly. No fluff or unnecessary details
- **Natural**: Use contractions (I'm, you're, it's), casual phrases, and natural transitions
- **Honest**: If something's not ideal, say it plainly. No sugar-coating
- **Warm but Professional**: Friendly and approachable, but you know your stuff
- **Story-driven**: Reference real experiences when relevant ("I've seen this before...")

## How You Analyze Properties:

**Initial Comparison** (keep it brief - 200-300 words max):
Start with your gut recommendation, then explain why in plain English. Focus on the 2-3 most important factors. Skip the obvious stuff.

Example opening:
"Okay, I've looked at all three properties, and honestly? I'd go with [address]. Here's why..."

**Structure your response naturally:**
1. Lead with your recommendation (1-2 sentences)
2. Main reason it's the best fit (2-3 sentences with key numbers)
3. Quick comparison to the others (2-3 sentences)
4. One important heads-up or opportunity (1-2 sentences)
5. Next step suggestion (1 sentence)

**Follow-up Questions:**
- Answer directly and briefly (100-150 words)
- Reference specific numbers only when they matter
- If it's a simple question, give a simple answer
- Don't repeat information you've already shared
- Ask clarifying questions if needed

## What to Focus On:
✅ Monthly payment vs their budget
✅ Deal quality (price vs value)
✅ Long-term costs that matter
✅ Red flags or opportunities
✅ Practical next steps

## What to Skip:
❌ Lengthy explanations of basic concepts
❌ Repeating data they can already see
❌ Overly detailed breakdowns unless asked
❌ Generic advice that applies to any property
❌ Formal language or corporate speak

## Tone Examples:

**Too Robotic (Don't do this):**
"Property 1 demonstrates superior affordability metrics with a DTI ratio of 25% compared to Property 2's 32%. The financial analysis indicates..."

**Natural Sarah (Do this):**
"Property 1 is the clear winner here. Your monthly payment would be $2,100 - well within your comfort zone. Property 2 stretches you thin at $2,600/month, and honestly, that extra $500 could stress your budget."

**Too Wordy (Don't do this):**
"After careful analysis of all three properties, taking into consideration your financial profile, budget constraints, and long-term goals, I would recommend..."

**Concise Sarah (Do this):**
"Go with Property 1. It's $50k under market value, fits your budget comfortably, and you'll save $15k over five years compared to the others."

## Key Phrases to Use:
- "Here's the thing..."
- "I've seen this before..."
- "Honestly..."
- "Here's what I'd do..."
- "The real question is..."
- "Don't worry about..."
- "Pay attention to..."
- "Between you and me..."

## Remember:
- You're having a conversation, not writing a report
- Quality over quantity - say less, mean more
- Lead with what matters most
- Be decisive - clients want your expert opinion
- Keep responses under 300 words unless they ask for details
- Use numbers sparingly - only when they tell the story

Your goal: Help them make a confident decision quickly, not overwhelm them with data.`;

export async function POST(request: NextRequest) {
  try {
    const { comparisonData, userMessage, conversationHistory, isInitial } = await request.json();
    
    console.log('🤖 Generating comparison analysis with Gemini...');
    
    // Prepare context from comparison data
    const context = prepareComparisonContext(comparisonData);
    
    let userPrompt = '';
    
    if (isInitial) {
      // Initial analysis request
      userPrompt = `Please analyze these ${comparisonData.propertyCount} properties and recommend the best choice for this buyer.

${context}

Provide a comprehensive comparison and clear recommendation based on the user's financial profile and the AI insights for each property.`;
    } else {
      // Follow-up question
      userPrompt = `${context}

User's question: ${userMessage}

Please answer based on the comparison data provided above.`;
    }
    
    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: COMPARISON_SYSTEM_PROMPT,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.9,
      },
    });
    
    console.log('📤 Calling Gemini API...');
    
    let analysis = '';
    
    // If there's conversation history, include it in the prompt
    if (conversationHistory && conversationHistory.length > 0) {
      // Build conversation context as text
      let conversationContext = 'Previous conversation:\n\n';
      conversationHistory.forEach((msg: any) => {
        const role = msg.role === 'assistant' ? 'Sarah' : 'User';
        conversationContext += `${role}: ${msg.content}\n\n`;
      });
      
      // Combine conversation context with current prompt
      const fullPrompt = `${conversationContext}\n---\n\n${userPrompt}`;
      
      // Use generateContent with full context
      const result = await model.generateContent(fullPrompt);
      analysis = result.response.text();
    } else {
      // For initial analysis, use generateContent directly
      const result = await model.generateContent(userPrompt);
      analysis = result.response.text();
    }
    
    console.log('✅ Comparison analysis generated');
    
    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('❌ Error generating comparison analysis:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate comparison analysis' },
      { status: 500 }
    );
  }
}

function prepareComparisonContext(comparisonData: any): string {
  const { userData, properties } = comparisonData;
  
  // Concise user profile
  let context = `USER: ${userData.displayName} | Income: $${(userData.annualIncome/1000).toFixed(0)}k/yr | Budget: $${userData.maxMonthlyBudget.toLocaleString()}/mo | Savings: $${(userData.availableSavings/1000).toFixed(0)}k | ${userData.downPayment < 1 ? (userData.downPayment * 100) + '%' : '$' + (userData.downPayment/1000).toFixed(0) + 'k'} down\n\n`;
  
  properties.forEach((property: any, index: number) => {
    const p = property.propertyData;
    const ai = property.aiInsights;
    
    context += `PROPERTY ${index + 1}: ${p.address}\n`;
    context += `Price: $${(p.price/1000).toFixed(0)}k | ${p.bedrooms}bd/${p.bathrooms}ba | ${p.sqft.toLocaleString()}sf | Zestimate: $${p.zestimate ? (p.zestimate/1000).toFixed(0) + 'k' : 'N/A'} | ${p.daysOnZillow || 'N/A'} days on market\n`;
    context += `Monthly: $${ai.monthlyPayment.toLocaleString()} | Affordability: ${ai.affordabilityScore}/100 (${ai.affordabilityLevel}) | DTI: ${ai.dtiRatio.toFixed(1)}% | Cash needed: $${(ai.financialBreakdown.totalCashNeeded/1000).toFixed(0)}k\n`;
    context += `5yr costs: Insurance $${(ai.insuranceBreakdown.total5Years/1000).toFixed(0)}k + Taxes $${(ai.propertyTaxBreakdown.total5Years/1000).toFixed(0)}k + HOA $${(ai.hoaFeesBreakdown.total5Years/1000).toFixed(0)}k + Maint $${(ai.maintenanceBreakdown.total5Years/1000).toFixed(0)}k = $${((ai.insuranceBreakdown.total5Years + ai.propertyTaxBreakdown.total5Years + ai.hoaFeesBreakdown.total5Years + ai.maintenanceBreakdown.total5Years)/1000).toFixed(0)}k total\n`;
    
    if (ai.keyInsights && ai.keyInsights.length > 0) {
      context += `Key: ${ai.keyInsights.slice(0, 2).join(' | ')}\n`;
    }
    
    if (ai.warnings && ai.warnings.length > 0) {
      context += `⚠️ ${ai.warnings[0]}\n`;
    }
    
    context += `\n`;
  });
  
  return context;
}
