/**
 * Property Analysis System
 * Generates AI-powered insights for homebuyers
 */

export interface UserProfile {
  // Required fields from Firestore
  uid: string;
  email: string;
  displayName: string;
  mode: string;
  
  // Homebuyer fields
  annualIncome: number;
  monthlyDebt: number;
  availableSavings: number;
  maxMonthlyBudget: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  includePMI: boolean;
  creditScore: string; // "excellent" | "good" | "fair" | "poor"
  riskComfort: string; // "conservative" | "balanced" | "aggressive"
  timeHorizon: string; // "1-3" | "3-5" | "5-10" | "10+"
  onboardingComplete: boolean;
  
  // Investor fields (optional)
  availableCapital?: number;
  downPaymentPercent?: number;
  targetLoanTerm?: 15 | 30;
  estimatedInterestRate?: number;
  targetCashFlow?: number;
  targetROI?: number;
  holdPeriod?: number;
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  useZillowRent?: boolean;
  vacancyRate?: number;
  maintenancePercent?: number;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  
  // Optional fields
  photoURL?: string;
  createdAt?: any;
  familySize?: number;
  workLocation?: { lat: number; lng: number };
  preferences?: {
    maxCommute?: number;
    minBedrooms?: number;
    mustHaves?: string[];
  };
}

export interface PropertyData {
  id: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotAreaValue?: number;
  zestimate?: number;
  rentZestimate?: number;
  taxAssessedValue?: number;
  daysOnZillow?: number;
  homeType?: string;
  lat: number;
  lng: number;
}

export interface FinancialAnalysis {
  affordabilityScore: number;
  affordabilityLevel: 'Affordable' | 'Stretch' | 'Too Expensive';
  monthlyPayment: {
    total: number;
    principal: number;
    interest: number;
    tax: number;
    insurance: number;
    hoa: number;
  };
  dtiRatio: number;
  downPaymentOptions: Array<{
    percentage: number;
    amount: number;
    monthlyPayment: number;
    pmi: number;
    recommendation: string;
  }>;
  closingCosts: {
    estimated: number;
    breakdown: {
      loanOrigination: number;
      appraisal: number;
      inspection: number;
      titleInsurance: number;
      other: number;
    };
  };
  totalCashNeeded: number;
  monthsOfSavingsRequired: number;
}

export interface InvestmentAnalysis {
  roiPotential: number;
  capRate: number;
  cashOnCashReturn: number;
  appreciationForecast: {
    year1: number;
    year5: number;
    year10: number;
  };
  priceVsZestimate: {
    difference: number;
    percentage: number;
    verdict: 'Overpriced' | 'Fair' | 'Underpriced';
  };
  rentVsBuy: {
    breakEvenYears: number;
    monthlyCashFlow: number;
    verdict: string;
  };
}

export interface MarketIntelligence {
  pricePerSqft: number;
  marketAvgPricePerSqft: number;
  competitiveness: 'High' | 'Medium' | 'Low';
  daysOnMarketInsight: {
    status: 'Fast Moving' | 'Normal' | 'Slow Moving';
    message: string;
  };
  priceHistory: {
    hasReduction: boolean;
    reductionAmount?: number;
    originalPrice?: number;
  };
  marketTrend: 'Hot' | 'Balanced' | 'Buyer\'s Market';
  priceVsZestimate: {
    difference: number;
    percentage: number;
    verdict: 'Overpriced' | 'Fair' | 'Underpriced';
  };
}

export interface RiskAssessment {
  overallRisk: 'Low' | 'Medium' | 'High';
  financialRisk: {
    score: number;
    factors: string[];
  };
  marketRisk: {
    score: number;
    factors: string[];
  };
  liquidityRisk: {
    score: number;
    estimatedTimeToSell: number;
  };
  recommendations: string[];
}

export interface PersonalizedRecommendations {
  negotiationStrategy: {
    suggestedOffer: number;
    reasoning: string;
    tactics: string[];
  };
  financingOptions: Array<{
    type: string;
    rate: number;
    pros: string[];
    cons: string[];
    recommended: boolean;
  }>;
  timeline: {
    bestTimeToOffer: string;
    urgency: 'High' | 'Medium' | 'Low';
    reasoning: string;
  };
  alternativeProperties?: Array<{
    reason: string;
    criteria: string;
  }>;
}

export interface LifestyleFitAnalysis {
  spaceAdequacy: {
    score: number;
    sqftPerPerson: number;
    verdict: string;
  };
  commuteImpact?: {
    estimatedTime: number;
    monthlyCost: number;
    verdict: string;
  };
  futureNeeds: {
    growingFamily: boolean;
    agingInPlace: boolean;
    recommendations: string[];
  };
  lifestyleMatchScore: number;
}

export interface AIAnalysisResult {
  financial: FinancialAnalysis;
  investment: InvestmentAnalysis;
  market: MarketIntelligence;
  risk: RiskAssessment;
  recommendations: PersonalizedRecommendations;
  lifestyle: LifestyleFitAnalysis;
  advisorMessage: string;
  keyInsights: string[];
  warnings: string[];
}

/**
 * Main Analysis Function
 * This will be called by your AI agent with tool calling
 */
export async function analyzeProperty(
  property: PropertyData,
  user: UserProfile,
  marketData?: any // Optional: nearby properties for comparison
): Promise<AIAnalysisResult> {
  
  // 1. Financial Analysis
  const financial = calculateFinancialAnalysis(property, user);
  
  // 2. Investment Analysis
  const investment = calculateInvestmentAnalysis(property, user);
  
  // 3. Market Intelligence
  const market = analyzeMarketConditions(property, marketData);
  
  // 4. Risk Assessment
  const risk = assessRisks(property, user, financial, market);
  
  // 5. Personalized Recommendations
  const recommendations = generateRecommendations(property, user, financial, market, risk);
  
  // 6. Lifestyle Fit
  const lifestyle = analyzeLifestyleFit(property, user);
  
  // 7. Generate AI Advisor Message
  const advisorMessage = generateAdvisorMessage(financial, investment, market, risk);
  
  // 8. Extract Key Insights
  const keyInsights = extractKeyInsights(financial, investment, market, risk, lifestyle);
  
  // 9. Identify Warnings
  const warnings = identifyWarnings(financial, risk, market);

  return {
    financial,
    investment,
    market,
    risk,
    recommendations,
    lifestyle,
    advisorMessage,
    keyInsights,
    warnings,
  };
}

// Helper Functions

function calculateFinancialAnalysis(property: PropertyData, user: UserProfile): FinancialAnalysis {
  // Use user's preferred down payment or default to 20%
  const downPaymentPercent = user.downPayment > 0 && user.downPayment < 1 
    ? user.downPayment 
    : user.downPayment / property.price; // Convert dollar amount to percentage
  
  const downPayment = property.price * downPaymentPercent;
  const loanAmount = property.price - downPayment;
  
  // Use user's interest rate from profile
  const interestRate = user.interestRate / 100; // Convert 7 to 0.07
  const loanTermYears = user.loanTerm; // Use user's loan term (30 years)
  
  // Monthly payment calculation
  const monthlyRate = interestRate / 12;
  const numPayments = loanTermYears * 12;
  const principalAndInterest = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  // Estimate property tax (1.5% of home value annually for Texas)
  const monthlyTax = (property.price * 0.015) / 12;
  
  // Estimate insurance ($1000-2000/year, scale with home value)
  const monthlyInsurance = Math.round((property.price / 450000) * 125);
  
  // HOA (if applicable)
  const monthlyHOA = 0;
  
  // PMI if down payment < 20% and user includes PMI
  const needsPMI = downPaymentPercent < 0.2 && user.includePMI;
  const monthlyPMI = needsPMI ? (loanAmount * 0.005) / 12 : 0;
  
  const totalMonthlyPayment = principalAndInterest + monthlyTax + monthlyInsurance + monthlyHOA + monthlyPMI;
  
  // DTI Calculation using user's annual income
  const monthlyIncome = user.annualIncome / 12;
  const totalMonthlyDebt = user.monthlyDebt + totalMonthlyPayment;
  const dtiRatio = (totalMonthlyDebt / monthlyIncome) * 100;
  
  // Affordability Score - also consider user's max monthly budget
  let affordabilityScore = 100;
  
  // Factor 1: DTI Ratio
  if (dtiRatio > 43) affordabilityScore = Math.max(0, 100 - (dtiRatio - 43) * 3);
  else if (dtiRatio > 36) affordabilityScore = 70 + ((43 - dtiRatio) / 7) * 30;
  else affordabilityScore = 70 + ((36 - dtiRatio) / 36) * 30;
  
  // Factor 2: Budget Compliance
  if (totalMonthlyPayment > user.maxMonthlyBudget) {
    const budgetOverage = ((totalMonthlyPayment - user.maxMonthlyBudget) / user.maxMonthlyBudget) * 100;
    affordabilityScore -= budgetOverage * 0.5; // Reduce score based on budget overage
  }
  
  affordabilityScore = Math.round(Math.min(100, Math.max(0, affordabilityScore)));
  
  // Adjust affordability level based on user's risk comfort
  let affordabilityLevel: 'Affordable' | 'Stretch' | 'Too Expensive';
  if (user.riskComfort === 'aggressive') {
    affordabilityLevel = affordabilityScore >= 60 ? 'Affordable' : affordabilityScore >= 35 ? 'Stretch' : 'Too Expensive';
  } else if (user.riskComfort === 'conservative') {
    affordabilityLevel = affordabilityScore >= 80 ? 'Affordable' : affordabilityScore >= 50 ? 'Stretch' : 'Too Expensive';
  } else { // balanced
    affordabilityLevel = affordabilityScore >= 70 ? 'Affordable' : affordabilityScore >= 40 ? 'Stretch' : 'Too Expensive';
  }
  
  // Down payment options based on user's available savings
  const downPaymentOptions = [5, 10, 20].map(percent => {
    const dp = property.price * (percent / 100);
    const loan = property.price - dp;
    const pmi = percent < 20 && user.includePMI ? (loan * 0.005) / 12 : 0;
    const payment = ((loan * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)) + monthlyTax + monthlyInsurance + pmi;
    
    const canAfford = dp <= user.availableSavings;
    
    return {
      percentage: percent,
      amount: Math.round(dp),
      monthlyPayment: Math.round(payment),
      pmi: Math.round(pmi),
      recommendation: !canAfford ? `Need $${Math.round(dp - user.availableSavings).toLocaleString()} more` :
        percent === 20 ? 'Recommended - No PMI' :
        percent === 10 ? 'Good balance' : 'Lower upfront, higher monthly',
    };
  });
  
  // Closing costs (2-5% of purchase price)
  const closingCostsPercent = 0.03;
  const totalClosingCosts = property.price * closingCostsPercent;
  
  // Calculate total cash needed
  const totalCashNeeded = downPayment + totalClosingCosts;
  
  // Calculate months of savings required (assuming 20% of monthly income goes to savings)
  const monthlySavingsCapacity = monthlyIncome * 0.2;
  const monthsOfSavingsRequired = Math.ceil((totalCashNeeded - user.availableSavings) / monthlySavingsCapacity);
  
  return {
    affordabilityScore,
    affordabilityLevel,
    monthlyPayment: {
      total: Math.round(totalMonthlyPayment),
      principal: Math.round(principalAndInterest * 0.3), // Approximate
      interest: Math.round(principalAndInterest * 0.7),
      tax: Math.round(monthlyTax),
      insurance: monthlyInsurance,
      hoa: monthlyHOA,
    },
    dtiRatio: Math.round(dtiRatio * 10) / 10,
    downPaymentOptions,
    closingCosts: {
      estimated: Math.round(totalClosingCosts),
      breakdown: {
        loanOrigination: Math.round(totalClosingCosts * 0.4),
        appraisal: 500,
        inspection: 400,
        titleInsurance: Math.round(totalClosingCosts * 0.3),
        other: Math.round(totalClosingCosts * 0.3) - 900,
      },
    },
    totalCashNeeded: Math.round(totalCashNeeded),
    monthsOfSavingsRequired: Math.max(0, monthsOfSavingsRequired),
  };
}

function calculateInvestmentAnalysis(property: PropertyData, user: UserProfile): InvestmentAnalysis {
  const rentZestimate = property.rentZestimate || property.price * 0.005; // 0.5% of price as fallback
  const annualRent = rentZestimate * 12;
  const annualExpenses = property.price * 0.02; // 2% for maintenance, insurance, etc.
  const noi = annualRent - annualExpenses;
  
  const capRate = (noi / property.price) * 100;
  const downPayment = property.price * 0.2;
  const cashOnCashReturn = (noi / downPayment) * 100;
  
  return {
    roiPotential: Math.round(cashOnCashReturn * 10) / 10,
    capRate: Math.round(capRate * 10) / 10,
    cashOnCashReturn: Math.round(cashOnCashReturn * 10) / 10,
    appreciationForecast: {
      year1: Math.round(property.price * 1.03),
      year5: Math.round(property.price * 1.15),
      year10: Math.round(property.price * 1.35),
    },
    priceVsZestimate: {
      difference: 0,
      percentage: 0,
      verdict: 'Fair',
    },
    rentVsBuy: {
      breakEvenYears: 5,
      monthlyCashFlow: Math.round(rentZestimate - (property.price * 0.005)),
      verdict: 'Buying is better long-term',
    },
  };
}

function analyzeMarketConditions(property: PropertyData, marketData?: any): MarketIntelligence {
  const pricePerSqft = property.price / property.sqft;
  const marketAvg = 150; // This would come from marketData in real implementation
  
  // Price vs Zestimate
  const zestimate = property.zestimate || property.price;
  const difference = property.price - zestimate;
  const percentage = (difference / zestimate) * 100;
  const verdict: 'Overpriced' | 'Fair' | 'Underpriced' =
    percentage > 5 ? 'Overpriced' :
    percentage < -5 ? 'Underpriced' : 'Fair';
  
  return {
    pricePerSqft: Math.round(pricePerSqft),
    marketAvgPricePerSqft: marketAvg,
    competitiveness: pricePerSqft > marketAvg * 1.1 ? 'Low' :
      pricePerSqft < marketAvg * 0.9 ? 'High' : 'Medium',
    daysOnMarketInsight: {
      status: (property.daysOnZillow || 0) < 14 ? 'Fast Moving' :
        (property.daysOnZillow || 0) > 60 ? 'Slow Moving' : 'Normal',
      message: (property.daysOnZillow || 0) < 14 ?
        'This property is moving quickly. Consider making an offer soon.' :
        'Property has been on market for a while. Good negotiation opportunity.',
    },
    priceHistory: {
      hasReduction: false,
    },
    marketTrend: 'Balanced',
    priceVsZestimate: {
      difference: Math.round(difference),
      percentage: Math.round(percentage * 10) / 10,
      verdict,
    },
  };
}

function assessRisks(
  property: PropertyData,
  user: UserProfile,
  financial: FinancialAnalysis,
  market: MarketIntelligence
): RiskAssessment {
  const financialRiskScore = financial.dtiRatio > 43 ? 80 : financial.dtiRatio > 36 ? 50 : 20;
  const marketRiskScore = market.competitiveness === 'Low' ? 60 : 30;
  
  return {
    overallRisk: financialRiskScore > 60 ? 'High' : financialRiskScore > 40 ? 'Medium' : 'Low',
    financialRisk: {
      score: financialRiskScore,
      factors: financial.dtiRatio > 43 ? ['High debt-to-income ratio'] : [],
    },
    marketRisk: {
      score: marketRiskScore,
      factors: [],
    },
    liquidityRisk: {
      score: 30,
      estimatedTimeToSell: 45,
    },
    recommendations: [
      'Build emergency fund of 6 months expenses',
      'Consider getting pre-approved for mortgage',
    ],
  };
}

function generateRecommendations(
  property: PropertyData,
  user: UserProfile,
  financial: FinancialAnalysis,
  market: MarketIntelligence,
  risk: RiskAssessment
): PersonalizedRecommendations {
  const suggestedOffer = market.priceVsZestimate.verdict === 'Overpriced' ?
    property.price * 0.95 : property.price * 0.98;
  
  return {
    negotiationStrategy: {
      suggestedOffer: Math.round(suggestedOffer),
      reasoning: 'Based on market analysis and days on market',
      tactics: [
        'Request seller concessions for closing costs',
        'Ask for home warranty',
        'Negotiate based on inspection findings',
      ],
    },
    financingOptions: [
      {
        type: 'Conventional 30-year fixed',
        rate: 7.0,
        pros: ['Predictable payments', 'Lower interest over time'],
        cons: ['Higher monthly payment than ARM'],
        recommended: true,
      },
      {
        type: 'FHA Loan',
        rate: 6.5,
        pros: ['Lower down payment (3.5%)', 'Easier qualification'],
        cons: ['Mortgage insurance required'],
        recommended: false,
      },
    ],
    timeline: {
      bestTimeToOffer: 'Within 1-2 weeks',
      urgency: market.daysOnMarketInsight.status === 'Fast Moving' ? 'High' : 'Medium',
      reasoning: market.daysOnMarketInsight.message,
    },
  };
}

function analyzeLifestyleFit(property: PropertyData, user: UserProfile): LifestyleFitAnalysis {
  const familySize = user.familySize || 2;
  const sqftPerPerson = property.sqft / familySize;
  
  return {
    spaceAdequacy: {
      score: sqftPerPerson > 600 ? 90 : sqftPerPerson > 400 ? 70 : 50,
      sqftPerPerson: Math.round(sqftPerPerson),
      verdict: sqftPerPerson > 600 ? 'Spacious' : sqftPerPerson > 400 ? 'Adequate' : 'Tight',
    },
    futureNeeds: {
      growingFamily: familySize < 4 && property.bedrooms >= 3,
      agingInPlace: property.homeType === 'SINGLE_FAMILY',
      recommendations: ['Consider future space needs', 'Check school districts'],
    },
    lifestyleMatchScore: 75,
  };
}

function generateAdvisorMessage(
  financial: FinancialAnalysis,
  investment: InvestmentAnalysis,
  market: MarketIntelligence,
  risk: RiskAssessment
): string {
  if (financial.affordabilityLevel === 'Affordable') {
    return `Great news, ${financial.dtiRatio < 36 ? 'this home fits comfortably' : 'this home works well'} within your budget! With a DTI of ${financial.dtiRatio}%, you'll have ${financial.dtiRatio < 36 ? 'plenty of' : 'adequate'} breathing room. The property is ${market.priceVsZestimate.verdict.toLowerCase()} and shows ${investment.roiPotential > 8 ? 'strong' : 'good'} investment potential with a ${investment.roiPotential}% ROI.`;
  } else if (financial.affordabilityLevel === 'Stretch') {
    return `This home is a stretch but manageable with careful planning. Your DTI of ${financial.dtiRatio}% is on the higher side. ${market.daysOnMarketInsight.message} I recommend building a larger emergency fund (6+ months) before committing, and ensure you're comfortable with the monthly payment of $${financial.monthlyPayment.total.toLocaleString()}.`;
  } else {
    return `I'd recommend looking at more affordable options. With a DTI of ${financial.dtiRatio}%, this home would put significant strain on your finances. A monthly payment of $${financial.monthlyPayment.total.toLocaleString()} exceeds your comfortable budget. Let's find something that gives you more financial security and peace of mind.`;
  }
}

function extractKeyInsights(
  financial: FinancialAnalysis,
  investment: InvestmentAnalysis,
  market: MarketIntelligence,
  risk: RiskAssessment,
  lifestyle: LifestyleFitAnalysis
): string[] {
  const insights: string[] = [];
  
  if (market.priceVsZestimate.verdict === 'Underpriced') {
    insights.push(`🎯 Great value! Property is ${Math.abs(market.priceVsZestimate.percentage)}% below Zestimate`);
  }
  
  if (market.daysOnMarketInsight.status === 'Fast Moving') {
    insights.push('⚡ Hot property! Moving faster than average');
  }
  
  if (financial.affordabilityScore >= 80) {
    insights.push('✅ Excellent affordability match for your budget');
  }
  
  if (investment.roiPotential > 8) {
    insights.push(`💰 Strong investment potential with ${investment.roiPotential}% ROI`);
  }
  
  if (lifestyle.spaceAdequacy.score >= 80) {
    insights.push(`🏡 Spacious living with ${lifestyle.spaceAdequacy.sqftPerPerson} sqft per person`);
  }
  
  return insights;
}

function identifyWarnings(
  financial: FinancialAnalysis,
  risk: RiskAssessment,
  market: MarketIntelligence
): string[] {
  const warnings: string[] = [];
  
  if (financial.dtiRatio > 43) {
    warnings.push('⚠️ High debt-to-income ratio may affect loan approval');
  }
  
  if (risk.overallRisk === 'High') {
    warnings.push('⚠️ High financial risk - consider building more savings');
  }
  
  if (market.competitiveness === 'Low') {
    warnings.push('⚠️ Property priced above market average');
  }
  
  if (financial.monthsOfSavingsRequired > 12) {
    warnings.push('⚠️ Significant savings required - may take over a year');
  }
  
  return warnings;
}
