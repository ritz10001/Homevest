/**
 * AI-Powered Property Analysis using Gemini API
 * Simple approach: Feed user data + property data to AI, get insights back
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = (process.env.GEMINI_API_KEY || 'AIzaSyCDBdElV8ymp_oRmJ3HmGaCB2ncVgU2T10');

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

export interface PropertyData {
  zpid: string;
  price: number;
  address: string;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
  beds: number;
  baths: number;
  area: number;
  homeType?: string;
  daysOnZillow?: number;
  zestimate?: number;
  rentZestimate?: number;
  taxAssessedValue?: number;
  lotAreaValue?: number;
  lotAreaUnit?: string;
  brokerName?: string;
}

export interface UserData {
  displayName: string;
  annualIncome: number;
  monthlyDebt: number;
  availableSavings: number;
  maxMonthlyBudget: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  includePMI: boolean;
  creditScore: string;
  riskComfort: string;
  timeHorizon: string;
}

export interface AIInsights {
  affordabilityScore: number;
  affordabilityLevel: 'Affordable' | 'Stretch' | 'Too Expensive';
  monthlyPayment: number;
  dtiRatio: number;
  advisorMessage: string;
  keyInsights: string[];
  warnings: string[];
  financialBreakdown: {
    downPaymentNeeded: number;
    closingCosts: number;
    totalCashNeeded: number;
    monthsToSave: number;
  };
  incomeBreakdown: {
    monthlyGrossIncome: number;
    monthlyNetIncome: number;
    afterHousingIncome: number;
    housingToIncomeRatio: number;
  };
  insuranceBreakdown: {
    year1: number;
    year2: number;
    year3: number;
    year4: number;
    year5: number;
    total5Years: number;
    averageMonthly: number;
    notes: string;
  };
  hoaFeesBreakdown: {
    monthlyFee: number;
    year1: number;
    year2: number;
    year3: number;
    year4: number;
    year5: number;
    total5Years: number;
    notes: string;
  };
  propertyTaxBreakdown: {
    annualTax: number;
    monthlyTax: number;
    effectiveRate: number;
    zipCode: string;
    year1: number;
    year2: number;
    year3: number;
    year4: number;
    year5: number;
    total5Years: number;
    notes: string;
  };
  maintenanceBreakdown: {
    monthlyReserve: number;
    year1: number;
    year2: number;
    year3: number;
    year4: number;
    year5: number;
    total5Years: number;
    notes: string;
  };
}

const SYSTEM_PROMPT = `You are Sarah, an expert AI home buying advisor with deep knowledge of real estate, mortgages, and personal finance. Your role is to analyze properties and provide personalized, actionable advice to homebuyers.

## Your Expertise:
- Real estate market analysis
- Mortgage calculations and financing options
- Debt-to-income ratio analysis
- Investment potential assessment
- Negotiation strategies
- Risk assessment
- Long-term cost projections

## Your Personality:
- Warm, friendly, and supportive
- Clear and direct in communication
- Empathetic to financial concerns
- Optimistic but realistic
- Uses emojis sparingly for emphasis

## Analysis Framework:

### 1. AFFORDABILITY ANALYSIS
Calculate and assess:
- Monthly mortgage payment (Principal + Interest + Tax + Insurance + PMI if applicable)
- Debt-to-Income ratio (Total monthly debt / Monthly income)
- Affordability score (0-100) based on DTI and budget compliance
- Affordability level: Affordable (70+), Stretch (40-69), Too Expensive (<40)

### 2. FINANCIAL BREAKDOWN
Provide:
- Down payment needed (based on user's preference)
- Estimated closing costs (2-3% of purchase price)
- Total cash needed at closing
- Months to save (if savings are insufficient)

### 3. INCOME BREAKDOWN
Calculate:
- Monthly gross income (annual income / 12)
- Monthly net income (estimate ~75% of gross after taxes)
- After-housing income (net income - total housing payment)
- Housing-to-income ratio (total housing payment / gross income)

### 4. INSURANCE BREAKDOWN (5-Year Projection)
Estimate homeowners insurance with 3-5% annual increases:
- Year 1: Base rate (~$1,200-$2,000 for Texas based on home value)
- Years 2-5: Apply inflation increases
- Total 5-year cost
- Average monthly cost
- Notes on factors affecting insurance (location, home age, coverage)

### 5. HOA FEES BREAKDOWN (5-Year Projection)
If HOA data available, project with 2-3% annual increases:
- Monthly HOA fee
- Years 1-5: Apply annual increases
- Total 5-year cost
- Notes on what HOA covers
- If no HOA: state "No HOA fees" with $0 values

### 6. PROPERTY TAX BREAKDOWN (5-Year Projection)
Calculate based on Texas property tax rates by zip code:
- Annual property tax (use 2.0-2.5% for Houston area, varies by zip)
- Monthly property tax
- Effective tax rate for the zip code
- Years 1-5: Project with 2-3% annual increases
- Total 5-year cost
- Notes on tax rates for specific zip code

### 7. MAINTENANCE BREAKDOWN (5-Year Projection)
Estimate using 1-2% of home value annually:
- Monthly maintenance reserve
- Year 1: Base maintenance costs
- Years 2-5: Increase by 3-4% annually
- Total 5-year cost
- Notes on typical maintenance needs (HVAC, roof, appliances, landscaping)

### 8. KEY INSIGHTS
Identify 3-5 most important findings:
- Value opportunities (underpriced properties)
- Market conditions (hot/slow moving)
- Budget fit
- Investment potential
- Space adequacy

### 9. WARNINGS
Flag critical concerns:
- High DTI ratio (>43%)
- Budget overruns
- Overpriced properties
- Insufficient savings
- Market risks

### 10. ADVISOR MESSAGE
Provide a personalized 2-3 sentence summary that:
- Addresses the user by name
- Gives clear verdict on affordability
- Highlights the most important consideration
- Offers actionable next steps

## Output Format:
Return a JSON object with this exact structure:
{
  "affordabilityScore": number (0-100),
  "affordabilityLevel": "Affordable" | "Stretch" | "Too Expensive",
  "monthlyPayment": number,
  "dtiRatio": number,
  "advisorMessage": "string",
  "keyInsights": ["string", "string", ...],
  "warnings": ["string", "string", ...],
  "financialBreakdown": {
    "downPaymentNeeded": number,
    "closingCosts": number,
    "totalCashNeeded": number,
    "monthsToSave": number
  },
  "incomeBreakdown": {
    "monthlyGrossIncome": number,
    "monthlyNetIncome": number,
    "afterHousingIncome": number,
    "housingToIncomeRatio": number
  },
  "insuranceBreakdown": {
    "year1": number,
    "year2": number,
    "year3": number,
    "year4": number,
    "year5": number,
    "total5Years": number,
    "averageMonthly": number,
    "notes": "string"
  },
  "hoaFeesBreakdown": {
    "monthlyFee": number,
    "year1": number,
    "year2": number,
    "year3": number,
    "year4": number,
    "year5": number,
    "total5Years": number,
    "notes": "string"
  },
  "propertyTaxBreakdown": {
    "annualTax": number,
    "monthlyTax": number,
    "effectiveRate": number,
    "zipCode": "string",
    "year1": number,
    "year2": number,
    "year3": number,
    "year4": number,
    "year5": number,
    "total5Years": number,
    "notes": "string"
  },
  "maintenanceBreakdown": {
    "monthlyReserve": number,
    "year1": number,
    "year2": number,
    "year3": number,
    "year4": number,
    "year5": number,
    "total5Years": number,
    "notes": "string"
  }
}

## Important Notes:
- Use standard mortgage formulas for calculations
- Property tax rate: 2.0-2.5% annually (varies by Houston zip code)
- Home insurance: ~$1,200-$2,500/year based on home value and location
- PMI: 0.5% annually if down payment < 20%
- Maintenance: 1-2% of home value annually
- Apply realistic inflation rates to all 5-year projections
- Be realistic but supportive in your advice
- Consider user's risk comfort level when making recommendations
- Use emojis in insights/warnings for visual appeal (🎯, ⚡, ✅, 💰, 🏡, ⚠️)`;

/**
 * Generate AI-powered property analysis
 */
export async function generateAIAnalysis(
  property: PropertyData,
  user: UserData
): Promise<AIInsights> {
  console.log('🤖 generateAIAnalysis called');
  console.log('Property:', property);
  console.log('User:', user);
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
      systemInstruction: SYSTEM_PROMPT,
    });
    console.log('✅ Gemini 2.5 Flash model initialized');

    const prompt = `Analyze this property for ${user.displayName}:

## USER PROFILE:
- Annual Income: $${user.annualIncome.toLocaleString()}
- Monthly Debt: $${user.monthlyDebt.toLocaleString()}
- Available Savings: $${user.availableSavings.toLocaleString()}
- Max Monthly Budget: $${user.maxMonthlyBudget.toLocaleString()}
- Preferred Down Payment: ${user.downPayment < 1 ? (user.downPayment * 100) + '%' : '$' + user.downPayment.toLocaleString()}
- Interest Rate: ${user.interestRate}%
- Loan Term: ${user.loanTerm} years
- Include PMI: ${user.includePMI ? 'Yes' : 'No'}
- Credit Score: ${user.creditScore}
- Risk Comfort: ${user.riskComfort}
- Time Horizon: ${user.timeHorizon} years

## PROPERTY DETAILS:
- Address: ${property.address}
- Price: $${property.price.toLocaleString()}
- Bedrooms: ${property.beds}
- Bathrooms: ${property.baths}
- Square Feet: ${property.area.toLocaleString()}
- Home Type: ${property.homeType || 'Single Family'}
- Days on Zillow: ${property.daysOnZillow || 'N/A'}
- Zestimate: $${property.zestimate?.toLocaleString() || 'N/A'}
- Rent Zestimate: $${property.rentZestimate?.toLocaleString() || 'N/A'}/month
- Tax Assessed Value: $${property.taxAssessedValue?.toLocaleString() || 'N/A'}
- Lot Size: ${property.lotAreaValue?.toLocaleString() || 'N/A'} ${property.lotAreaUnit || 'sqft'}
- Listed by: ${property.brokerName || 'N/A'}

Provide a comprehensive analysis following the framework. Return ONLY valid JSON, no markdown formatting.`;

    console.log('📤 Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('📥 Received response from Gemini');
    console.log('Raw response length:', text.length);
    console.log('Raw response preview:', text.substring(0, 500));
    
    // Clean up the response (remove markdown code blocks if present)
    let cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    console.log('Cleaned response length:', cleanedText.length);
    console.log('Cleaned response:', cleanedText);
    
    // Check if JSON is incomplete (doesn't end with })
    if (!cleanedText.endsWith('}')) {
      console.log('⚠️ JSON appears incomplete, attempting to complete it...');
      
      // Find the last complete property by looking for the last valid comma or colon
      const lastComma = cleanedText.lastIndexOf(',');
      const lastColon = cleanedText.lastIndexOf(':');
      const lastQuote = cleanedText.lastIndexOf('"');
      
      // If we're in the middle of a value, truncate to last complete property
      if (lastColon > lastComma && lastQuote > lastColon) {
        // We're in the middle of a property value, remove incomplete part
        cleanedText = cleanedText.substring(0, lastComma);
      } else if (lastColon > lastComma) {
        // We have a property name but no value, remove it
        const lastCompleteComma = cleanedText.lastIndexOf(',', lastColon - 1);
        if (lastCompleteComma > 0) {
          cleanedText = cleanedText.substring(0, lastCompleteComma);
        }
      }
      
      // Now count and close braces/brackets
      let openBraces = 0;
      let openBrackets = 0;
      let inString = false;
      let escapeNext = false;
      
      for (let i = 0; i < cleanedText.length; i++) {
        const char = cleanedText[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        if (char === '"') {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') openBraces++;
          if (char === '}') openBraces--;
          if (char === '[') openBrackets++;
          if (char === ']') openBrackets--;
        }
      }
      
      console.log('Open braces:', openBraces, 'Open brackets:', openBrackets);
      
      // Close any open strings
      if (inString) {
        cleanedText += '"';
      }
      
      // Close open brackets and braces
      for (let i = 0; i < openBrackets; i++) {
        cleanedText += ']';
      }
      for (let i = 0; i < openBraces; i++) {
        cleanedText += '}';
      }
      
      console.log('Completed JSON, new length:', cleanedText.length);
      console.log('Completed JSON:', cleanedText);
    }
    
    const analysis = JSON.parse(cleanedText);
    console.log('✅ Parsed analysis successfully');
    
    return analysis;
  } catch (error) {
    console.error('❌ Error generating AI analysis:', error);
    console.error('Error details:', error);
    
    // Re-throw the error instead of returning fallback
    throw new Error('Failed to generate AI analysis. Please check your API key and try again.');
  }
}


/**
 * Universal Analysis Function - Routes to Sarah or William based on user mode
 */
import { WILLIAM_SYSTEM_PROMPT, InvestorUserData, InvestorInsights } from './investorAnalysis';

export async function generateUniversalAnalysis(
  property: PropertyData,
  user: UserData | InvestorUserData | any
): Promise<AIInsights | InvestorInsights> {
  console.log('🤖 generateUniversalAnalysis called');
  console.log('Full user data:', JSON.stringify(user, null, 2));
  console.log('User mode:', user.mode);
  
  // Validate user data
  if (!user) {
    throw new Error('User data is required for analysis');
  }
  
  // Check if user is investor
  const isInvestor = user.mode === 'investor';
  
  if (isInvestor) {
    // Validate investor fields
    if (!user.availableCapital || !user.downPaymentPercent || !user.estimatedInterestRate) {
      throw new Error('Investor profile is incomplete. Please complete onboarding first.');
    }
    return generateInvestorAnalysis(property, user as InvestorUserData);
  } else {
    // Validate homebuyer fields
    if (!user.annualIncome || !user.monthlyDebt || !user.availableSavings) {
      console.error('Missing homebuyer fields:', {
        hasAnnualIncome: !!user.annualIncome,
        hasMonthlyDebt: !!user.monthlyDebt,
        hasAvailableSavings: !!user.availableSavings,
        hasMaxMonthlyBudget: !!user.maxMonthlyBudget,
        hasDownPayment: !!user.downPayment
      });
      throw new Error('Homebuyer profile is incomplete. Please complete onboarding first.');
    }
    return generateAIAnalysis(property, user as UserData);
  }
}

/**
 * Generate William's Investor Analysis
 */
async function generateInvestorAnalysis(
  property: PropertyData,
  user: InvestorUserData
): Promise<InvestorInsights> {
  console.log('🤖 generateInvestorAnalysis called (William)');

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
      systemInstruction: WILLIAM_SYSTEM_PROMPT,
    });
    console.log('✅ Gemini 2.0 Flash model initialized for William');

    const dp = property.price * (user.downPaymentPercent / 100);
    const rent = property.rentZestimate || 2500;

    const prompt = `Analyze: ${property.address}, Price $${property.price.toLocaleString()}, ${property.beds}bd/${property.baths}ba, ${property.area}sf, Rent $${rent}/mo
Investor: ${user.displayName}, Capital $${user.availableCapital?.toLocaleString()}, ${user.downPaymentPercent}% down, ${user.estimatedInterestRate}% rate, ${user.targetLoanTerm}yr term, Hold ${user.holdPeriod}yr
Return complete valid JSON.`;

    console.log('📤 Sending to Gemini...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log('📥 Response length:', text.length);
    console.log('📥 Full response:', text);

    let cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    console.log('Cleaned response length:', cleanedText.length);
    console.log('Cleaned response:', cleanedText);
    
    // Check if JSON is incomplete (doesn't end with })
    if (!cleanedText.endsWith('}')) {
      console.log('⚠️ JSON appears incomplete, attempting to complete it...');
      
      // Find the last complete property by looking for the last valid comma or colon
      const lastComma = cleanedText.lastIndexOf(',');
      const lastColon = cleanedText.lastIndexOf(':');
      const lastQuote = cleanedText.lastIndexOf('"');
      
      // If we're in the middle of a value, truncate to last complete property
      if (lastColon > lastComma && lastQuote > lastColon) {
        // We're in the middle of a property value, remove incomplete part
        cleanedText = cleanedText.substring(0, lastComma);
      } else if (lastColon > lastComma) {
        // We have a property name but no value, remove it
        const lastCompleteComma = cleanedText.lastIndexOf(',', lastColon - 1);
        if (lastCompleteComma > 0) {
          cleanedText = cleanedText.substring(0, lastCompleteComma);
        }
      }
      
      // Now count and close braces/brackets
      let openBraces = 0;
      let openBrackets = 0;
      let inString = false;
      let escapeNext = false;
      
      for (let i = 0; i < cleanedText.length; i++) {
        const char = cleanedText[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        if (char === '"') {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') openBraces++;
          if (char === '}') openBraces--;
          if (char === '[') openBrackets++;
          if (char === ']') openBrackets--;
        }
      }
      
      console.log('Open braces:', openBraces, 'Open brackets:', openBrackets);
      
      // Close any open strings
      if (inString) {
        cleanedText += '"';
      }
      
      // Close open brackets and braces
      for (let i = 0; i < openBrackets; i++) {
        cleanedText += ']';
      }
      for (let i = 0; i < openBraces; i++) {
        cleanedText += '}';
      }
      
      console.log('Completed JSON, new length:', cleanedText.length);
      console.log('Completed JSON:', cleanedText);
    }

    const analysis = JSON.parse(cleanedText);
    console.log('✅ Parsed successfully');

    return analysis;
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    throw new Error(`Failed to generate investment analysis: ${error.message}`);
  }
}


