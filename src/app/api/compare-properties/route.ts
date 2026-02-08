import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Sarah's Homebuyer Comparison Prompt
const SARAH_COMPARISON_PROMPT = `You are Sarah, a seasoned real estate advisor with 15+ years of experience helping clients find their perfect home.

Your Communication Style: Conversational, concise, natural, honest, warm but professional.

Initial Comparison (200-300 words max): Start with your recommendation, explain why with 2-3 key factors.

Example: "Okay, I've looked at all three properties, and honestly? I'd go with [address]. Here's why..."

Focus On: Monthly payment vs budget, deal quality, long-term costs, red flags/opportunities, next steps.

Key Phrases: "Here's the thing...", "I've seen this before...", "Honestly...", "Here's what I'd do..."

Goal: Help them make a confident decision quickly, not overwhelm them with data.`;

// William's Investor Comparison Prompt
const WILLIAM_COMPARISON_PROMPT = `You are William, a seasoned real estate investment advisor with 20+ years of experience helping investors build profitable portfolios.

Your Communication Style: Professional, analytical, strategic, direct, honest, experienced.

Initial Comparison (300-400 words max): Start with your investment verdict, explain why with key metrics.

Example: "Alright, I've analyzed all three properties, and here's my take: Property 2 is your best investment. Here's why..."

Focus On: Cash-on-cash return, monthly cash flow, cap rate & DSCR, deal quality, risk factors, total return potential.

Key Phrases: "Here's the deal...", "The numbers don't lie...", "I've seen this before...", "Here's what matters..."

Goal: Help them choose the best investment property quickly with confidence, not create analysis paralysis.`;

export async function POST(request: NextRequest) {
  try {
    const { comparisonData, userMessage, conversationHistory, isInitial } = await request.json();
    
    console.log('🤖 Generating comparison analysis with Gemini...');
    console.log('User mode:', comparisonData.userData?.mode);
    
    // Determine which advisor to use based on user mode
    const isInvestor = comparisonData.userData?.mode === 'investor';
    const systemPrompt = isInvestor ? WILLIAM_COMPARISON_PROMPT : SARAH_COMPARISON_PROMPT;
    const advisorName = isInvestor ? 'William' : 'Sarah';
    
    console.log(`Using ${advisorName}'s comparison prompt`);
    
    // Prepare context from comparison data
    const context = prepareComparisonContext(comparisonData, isInvestor);
    
    let userPrompt = '';
    
    if (isInitial) {
      // Initial analysis request
      const clientType = isInvestor ? 'investor' : 'buyer';
      userPrompt = `Please analyze these ${comparisonData.propertyCount} properties and recommend the best choice for this ${clientType}.

${context}

Provide a comprehensive comparison and clear recommendation.`;
    } else {
      // Follow-up question
      userPrompt = `${context}

User's question: ${userMessage}

Please answer based on the comparison data provided above.`;
    }
    
    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
      generationConfig: {
        maxOutputTokens: 8192,
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
        const role = msg.role === 'assistant' ? advisorName : 'User';
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

function prepareComparisonContext(comparisonData: any, isInvestor: boolean = false): string {
  const { userData, properties } = comparisonData;
  
  // Concise user profile
  let context = '';
  
  if (isInvestor) {
    // Investor profile
    const capital = userData.availableCapital || 0;
    const downPct = userData.downPaymentPercent || 20;
    const rate = userData.estimatedInterestRate || 7;
    const term = userData.targetLoanTerm || 30;
    const targetROI = userData.targetROI || 10;
    const targetCF = userData.targetCashFlow || 200;
    const hold = userData.holdPeriod || 5;
    const risk = userData.riskTolerance || 'moderate';
    
    context = `INVESTOR: ${userData.displayName} | Capital: ${(capital/1000).toFixed(0)}k | ${downPct}% down | ${rate}% rate | ${term}yr term | Target ROI: ${targetROI}% | Target Cash Flow: $${targetCF}/mo | Hold: ${hold}yr | Risk: ${risk}\n\n`;
  } else {
    // Homebuyer profile - with safe defaults
    const income = userData.annualIncome || 0;
    const budget = userData.maxMonthlyBudget || 0;
    const savings = userData.availableSavings || 0;
    const downPayment = userData.downPayment || 0;
    
    context = `USER: ${userData.displayName} | Income: ${(income/1000).toFixed(0)}k/yr | Budget: $${budget.toLocaleString()}/mo | Savings: ${(savings/1000).toFixed(0)}k | ${downPayment < 1 ? (downPayment * 100) + '%' : (downPayment/1000).toFixed(0) + 'k'} down\n\n`;
  }
  
  properties.forEach((property: any, index: number) => {
    const p = property.propertyData;
    const ai = property.aiInsights;
    
    context += `PROPERTY ${index + 1}: ${p.address}\n`;
    context += `Price: ${(p.price/1000).toFixed(0)}k | ${p.bedrooms}bd/${p.bathrooms}ba | ${p.sqft.toLocaleString()}sf | Zestimate: ${p.zestimate ? (p.zestimate/1000).toFixed(0) + 'k' : 'N/A'} | ${p.daysOnZillow || 'N/A'} days on market\n`;
    
    if (isInvestor) {
      // Investor metrics
      context += `Monthly Cash Flow: $${ai.monthlyCashFlow?.toLocaleString() || 'N/A'} | Cash-on-Cash: ${ai.cashOnCashReturn?.toFixed(1) || 'N/A'}% | Cap Rate: ${ai.capRate?.toFixed(1) || 'N/A'}% | DSCR: ${ai.dscr?.toFixed(2) || 'N/A'} | Investment Score: ${ai.investmentScore || 'N/A'}/100 (${ai.investmentLevel || 'N/A'})\n`;
      context += `5yr Total Return: $${((ai.fiveYearSummary?.totalReturn || 0)/1000).toFixed(0)}k | Avg Annual Return: ${ai.fiveYearSummary?.avgAnnualReturn?.toFixed(1) || 'N/A'}%\n`;
    } else {
      // Homebuyer metrics
      context += `Monthly: $${ai.monthlyPayment?.toLocaleString() || 'N/A'} | Affordability: ${ai.affordabilityScore || 'N/A'}/100 (${ai.affordabilityLevel || 'N/A'}) | DTI: ${ai.dtiRatio?.toFixed(1) || 'N/A'}% | Cash needed: ${((ai.financialBreakdown?.totalCashNeeded || 0)/1000).toFixed(0)}k\n`;
      context += `5yr costs: Insurance ${((ai.insuranceBreakdown?.total5Years || 0)/1000).toFixed(0)}k + Taxes ${((ai.propertyTaxBreakdown?.total5Years || 0)/1000).toFixed(0)}k + HOA ${((ai.hoaFeesBreakdown?.total5Years || 0)/1000).toFixed(0)}k + Maint ${((ai.maintenanceBreakdown?.total5Years || 0)/1000).toFixed(0)}k = ${(((ai.insuranceBreakdown?.total5Years || 0) + (ai.propertyTaxBreakdown?.total5Years || 0) + (ai.hoaFeesBreakdown?.total5Years || 0) + (ai.maintenanceBreakdown?.total5Years || 0))/1000).toFixed(0)}k total\n`;
    }
    
    if (ai.keyInsights && ai.keyInsights.length > 0) {
      context += `Key: ${ai.keyInsights.slice(0, 2).join(' | ')}\n`;
    }
    
    if (ai.warnings && ai.warnings.length > 0) {
      context += `⚠️ ${ai.warnings[0]}\n`;
    } else if (ai.investmentWarnings && ai.investmentWarnings.length > 0) {
      context += `⚠️ ${ai.investmentWarnings[0]}\n`;
    }
    
    context += `\n`;
  });
  
  return context;
}
