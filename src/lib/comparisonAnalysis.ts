/**
 * Property Comparison Analysis Types and Utilities
 */

export interface ComparisonProperty {
  zpid: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lat: number;
  lng: number;
  aiInsights?: any; // Full AI insights from initial analysis
}

export interface ComparisonAnalysis {
  recommendation: {
    bestProperty: string; // zpid of recommended property
    reason: string;
    confidenceLevel: 'High' | 'Medium' | 'Low';
  };
  summary: string;
  detailedComparison: {
    affordability: {
      winner: string;
      analysis: string;
      scores: { [zpid: string]: number };
    };
    value: {
      winner: string;
      analysis: string;
      metrics: { [zpid: string]: string };
    };
    longTermCosts: {
      winner: string;
      analysis: string;
      totals: { [zpid: string]: number };
    };
    investment: {
      winner: string;
      analysis: string;
      potential: { [zpid: string]: string };
    };
  };
  propertyBreakdown: Array<{
    zpid: string;
    address: string;
    pros: string[];
    cons: string[];
    score: number;
  }>;
  keyFactors: string[];
  nextSteps: string[];
}
