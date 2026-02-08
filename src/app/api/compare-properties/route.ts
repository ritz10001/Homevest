import { NextRequest, NextResponse } from 'next/server';

const FEATHERLESS_API_KEY = process.env.FEATHERLESS_API_KEY;
const FEATHERLESS_API_URL = 'https://api.featherless.ai/v1/chat/completions';

if (!FEATHERLESS_API_KEY) {
  console.warn('⚠️ FEATHERLESS_API_KEY not found, comparison feature will not work');
}

const COMPARISON_SYSTEM_PROMPT = `You are HomePilot Comparison Advisor, an expert AI assistant specializing in helping first-time homebuyers compare properties and make informed decisions.

## Your Role
Analyze multiple properties side-by-side considering the user's financial situation, preferences, and long-term goals. Provide clear, actionable recommendations on which property is the best fit.

## Analysis Framework

### 1. Affordability Comparison
- Compare monthly payments, DTI ratios, and cash needed
- Identify which property fits best within budget
- Consider financial stress levels for each option

### 2. Value Analysis
- Price per square foot comparison
- Price vs Zestimate analysis
- Market positioning (overpriced/underpriced)
- Days on market implications

### 3. Long-Term Cost Comparison
- 5-year total ownership costs (taxes, insurance, HOA, maintenance)
- Appreciation potential
- Resale value considerations

### 4. Investment Potential (for first-time buyers)
- House hacking opportunities (room rental potential)
- Future rental income if they move
- Neighborhood growth trajectory
- Equity building rate

### 5. Lifestyle Fit
- Location advantages/disadvantages
- Space adequacy (bedrooms, bathrooms, sqft)
- Commute, schools, amenities
- Home type and lot size

## Output Format
Return a JSON object with this structure:
{
  "recommendation": {
    "bestProperty": "zpid of recommended property",
    "reason": "2-3 sentence summary of why this is the best choice",
    "confidenceLevel": "High" | "Medium" | "Low"
  },
  "summary": "3-4 sentence executive summary comparing all properties",
  "detailedComparison": {
    "affordability": {
      "winner": "zpid",
      "analysis": "detailed explanation",
      "scores": { "zpid1": score, "zpid2": score }
    },
    "value": {
      "winner": "zpid",
      "analysis": "detailed explanation",
      "metrics": { "zpid1": "metric description", "zpid2": "metric description" }
    },
    "longTermCosts": {
      "winner": "zpid",
      "analysis": "detailed explanation",
      "totals": { "zpid1": total5YearCost, "zpid2": total5YearCost }
    },
    "investment": {
      "winner": "zpid",
      "analysis": "detailed explanation",
      "potential": { "zpid1": "potential description", "zpid2": "potential description" }
    }
  },
  "propertyBreakdown": [
    {
      "zpid": "property id",
      "address": "full address",
      "pros": ["pro 1", "pro 2", "pro 3"],
      "cons": ["con 1", "con 2"],
      "score": 85
    }
  ],
  "keyFactors": ["factor 1", "factor 2", "factor 3"],
  "nextSteps": ["step 1", "step 2", "step 3"]
}

## Guidelines
- Be decisive but explain your reasoning
- Consider the user's specific financial situation
- Think long-term (5-10 years)
- Acknowledge trade-offs honestly
- Provide actionable next steps
- Use specific numbers from the data
- Consider first-time buyer needs (stability, equity building, manageable costs)`;

export async function POST(request: NextRequest) {
  try {
    const { userData, properties } = await request.json();
    
    console.log('🔍 Comparison API: Starting analysis...');
    console.log(`Properties to compare: ${properties.length}`);
    
    if (!FEATHERLESS_API_KEY) {
      throw new Error('Featherless API key not configured');
    }
    
    // Build comprehensive prompt with all data
    const prompt = buildComparisonPrompt(userData, properties);
    
    console.log('📤 Sending to DeepSeek via Featherless...');
    
    const response = await fetch(FEATHERLESS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FEATHERLESS_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages: [
          { role: 'system', content: COMPARISON_SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Featherless API error:', errorText);
      throw new Error(`Featherless API error: ${response.status}`);
    }
    
    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    console.log('📥 Received response from DeepSeek via Featherless');
    
    // Parse JSON from response
    const cleanedText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const analysis = JSON.parse(cleanedText);
    
    console.log('✅ Comparison analysis complete');
    
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('❌ Comparison API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate comparison analysis' },
      { status: 500 }
    );
  }
}

function buildComparisonPrompt(userData: any, properties: any[]): string {
  let prompt = `Compare these properties for ${userData.displayName}, a first-time homebuyer:\n\n`;
  
  // User Profile
  prompt += `## USER PROFILE:\n`;
  prompt += `- Annual Income: $${userData.annualIncome.toLocaleString()}\n`;
  prompt += `- Monthly Debt: $${userData.monthlyDebt.toLocaleString()}\n`;
  prompt += `- Available Savings: $${userData.availableSavings.toLocaleString()}\n`;
  prompt += `- Max Monthly Budget: $${userData.maxMonthlyBudget.toLocaleString()}\n`;
  prompt += `- Down Payment: ${userData.downPayment < 1 ? (userData.downPayment * 100) + '%' : '$' + userData.downPayment.toLocaleString()}\n`;
  prompt += `- Interest Rate: ${userData.interestRate}%\n`;
  prompt += `- Credit Score: ${userData.creditScore}\n`;
  prompt += `- Risk Comfort: ${userData.riskComfort}\n`;
  prompt += `- Time Horizon: ${userData.timeHorizon} years\n\n`;
  
  // Properties
  properties.forEach((prop, index) => {
    prompt += `## PROPERTY ${index + 1}: ${prop.propertyData.address}\n`;
    prompt += `**Basic Info:**\n`;
    prompt += `- ZPID: ${prop.propertyData.zpid}\n`;
    prompt += `- Price: $${prop.propertyData.price.toLocaleString()}\n`;
    prompt += `- Bedrooms: ${prop.propertyData.beds}\n`;
    prompt += `- Bathrooms: ${prop.propertyData.baths}\n`;
    prompt += `- Square Feet: ${prop.propertyData.area.toLocaleString()}\n`;
    prompt += `- Home Type: ${prop.propertyData.homeType || 'Single Family'}\n`;
    prompt += `- Days on Market: ${prop.propertyData.daysOnZillow || 'N/A'}\n`;
    prompt += `- Zestimate: $${prop.propertyData.zestimate?.toLocaleString() || 'N/A'}\n`;
    prompt += `- Rent Zestimate: $${prop.propertyData.rentZestimate?.toLocaleString() || 'N/A'}/month\n\n`;
    
    if (prop.aiInsights) {
      prompt += `**AI Analysis:**\n`;
      prompt += `- Affordability Score: ${prop.aiInsights.affordabilityScore}/100 (${prop.aiInsights.affordabilityLevel})\n`;
      prompt += `- Monthly Payment: $${prop.aiInsights.monthlyPayment.toLocaleString()}\n`;
      prompt += `- DTI Ratio: ${prop.aiInsights.dtiRatio.toFixed(1)}%\n`;
      prompt += `- Total Cash Needed: $${prop.aiInsights.financialBreakdown.totalCashNeeded.toLocaleString()}\n`;
      prompt += `- 5-Year Total Costs: $${(
        prop.aiInsights.insuranceBreakdown.total5Years +
        prop.aiInsights.propertyTaxBreakdown.total5Years +
        prop.aiInsights.hoaFeesBreakdown.total5Years +
        prop.aiInsights.maintenanceBreakdown.total5Years
      ).toLocaleString()}\n`;
      
      if (prop.aiInsights.keyInsights?.length > 0) {
        prompt += `- Key Insights: ${prop.aiInsights.keyInsights.slice(0, 3).join('; ')}\n`;
      }
      
      if (prop.aiInsights.warnings?.length > 0) {
        prompt += `- Warnings: ${prop.aiInsights.warnings.join('; ')}\n`;
      }
    }
    
    prompt += `\n`;
  });
  
  prompt += `\nProvide a comprehensive comparison analysis and recommend the best property for this first-time homebuyer. Return ONLY valid JSON following the specified format.`;
  
  return prompt;
}
