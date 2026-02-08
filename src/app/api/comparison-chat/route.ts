import { NextRequest, NextResponse } from 'next/server';

const FEATHERLESS_API_KEY = process.env.FEATHERLESS_API_KEY;
const FEATHERLESS_API_URL = 'https://api.featherless.ai/v1/chat/completions';

if (!FEATHERLESS_API_KEY) {
  console.warn('⚠️ FEATHERLESS_API_KEY not found, comparison chat will not work');
}

const CHAT_SYSTEM_PROMPT = `You are HomePilot Advanced, an expert AI real estate advisor powered by DeepSeek. You specialize in providing personalized, conversational guidance for homebuyers and investors.

## Your Role
You help users understand property comparisons, answer follow-up questions, and provide detailed analysis when they want to explore different scenarios or change variables.

## Context You Have
You have access to:
1. User's financial profile (income, debt, savings, preferences)
2. Multiple property details (price, features, location)
3. Initial AI analysis for each property (affordability, costs, insights)
4. Comparison analysis showing which property is recommended

## Your Capabilities

### 1. Answer Follow-Up Questions
- Explain why one property is better than another
- Clarify specific metrics or calculations
- Provide more details on any aspect of the analysis
- Compare specific features between properties

### 2. Scenario Analysis ("What If" Questions)
When users ask "what if" questions, recalculate and show:
- "What if I put down 20% instead of 10%?"
- "What if interest rates drop to 6%?"
- "What if I get a $10k raise?"
- "What if I rent out a room for $800/month?"

Show before/after comparisons with specific numbers.

### 3. Negotiation Advice
Provide specific negotiation strategies for:
- First-time homebuyers
- Investors
- Different market conditions
- Based on days on market and price vs zestimate

### 4. Investment Strategy Guidance
Explain:
- House hacking opportunities
- Rental income potential
- Long-term appreciation
- Tax benefits
- ROI calculations

## Response Style
- Conversational and friendly
- Use specific numbers from the context
- Provide actionable advice
- Acknowledge trade-offs
- Think long-term (5-10 years)
- Use emojis sparingly for emphasis

## Important
- Always reference the specific properties and data provided
- Recalculate when variables change
- Be honest about risks and downsides
- Provide multiple options when appropriate
- Consider the user's specific financial situation`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, context } = await request.json();
    
    console.log('💬 Comparison Chat API: Processing message...');
    
    if (!FEATHERLESS_API_KEY) {
      throw new Error('Featherless API key not configured');
    }
    
    // Build context message
    const contextMessage = buildContextMessage(context);
    
    // Build messages array
    const messages = [
      { role: 'system', content: CHAT_SYSTEM_PROMPT },
      { role: 'system', content: contextMessage },
      ...conversationHistory,
      { role: 'user', content: message }
    ];
    
    console.log('📤 Sending to DeepSeek via Featherless...');
    
    const response = await fetch(FEATHERLESS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FEATHERLESS_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Featherless API error:', errorText);
      throw new Error(`Featherless API error: ${response.status}`);
    }
    
    const data = await response.json();
    const reply = data.choices[0].message.content;
    
    console.log('📥 Received response from DeepSeek');
    
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('❌ Comparison Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

function buildContextMessage(context: any): string {
  let contextMsg = `## CONTEXT FOR THIS CONVERSATION\n\n`;
  
  // User Profile
  if (context.userData) {
    contextMsg += `### User Profile:\n`;
    contextMsg += `- Name: ${context.userData.displayName}\n`;
    contextMsg += `- Annual Income: $${context.userData.annualIncome?.toLocaleString()}\n`;
    contextMsg += `- Monthly Debt: $${context.userData.monthlyDebt?.toLocaleString()}\n`;
    contextMsg += `- Available Savings: $${context.userData.availableSavings?.toLocaleString()}\n`;
    contextMsg += `- Max Monthly Budget: $${context.userData.maxMonthlyBudget?.toLocaleString()}\n`;
    contextMsg += `- Down Payment: ${context.userData.downPayment < 1 ? (context.userData.downPayment * 100) + '%' : '$' + context.userData.downPayment?.toLocaleString()}\n`;
    contextMsg += `- Interest Rate: ${context.userData.interestRate}%\n`;
    contextMsg += `- Credit Score: ${context.userData.creditScore}\n\n`;
  }
  
  // Properties Being Compared
  if (context.properties && context.properties.length > 0) {
    contextMsg += `### Properties Being Compared:\n\n`;
    context.properties.forEach((prop: any, index: number) => {
      contextMsg += `**Property ${index + 1}:**\n`;
      contextMsg += `- Address: ${prop.address}\n`;
      contextMsg += `- Price: $${prop.price?.toLocaleString()}\n`;
      contextMsg += `- Beds/Baths: ${prop.bedrooms}/${prop.bathrooms}\n`;
      contextMsg += `- Square Feet: ${prop.sqft?.toLocaleString()}\n`;
      
      if (prop.aiInsights) {
        contextMsg += `- Affordability Score: ${prop.aiInsights.affordabilityScore}/100\n`;
        contextMsg += `- Monthly Payment: $${prop.aiInsights.monthlyPayment?.toLocaleString()}\n`;
        contextMsg += `- DTI Ratio: ${prop.aiInsights.dtiRatio?.toFixed(1)}%\n`;
      }
      contextMsg += `\n`;
    });
  }
  
  // Comparison Analysis
  if (context.comparisonAnalysis) {
    contextMsg += `### Comparison Analysis:\n`;
    contextMsg += `- Recommended Property: ${context.comparisonAnalysis.recommendation?.bestProperty}\n`;
    contextMsg += `- Reason: ${context.comparisonAnalysis.recommendation?.reason}\n`;
    contextMsg += `- Confidence: ${context.comparisonAnalysis.recommendation?.confidenceLevel}\n\n`;
    contextMsg += `Summary: ${context.comparisonAnalysis.summary}\n\n`;
  }
  
  contextMsg += `Use this context to answer the user's questions accurately and provide personalized advice.\n`;
  
  return contextMsg;
}
