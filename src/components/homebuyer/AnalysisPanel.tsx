'use client';

import { motion } from 'framer-motion';
import { Home, DollarSign, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface Property {
  id: number;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lat: number;
  lng: number;
  zpid?: string;
  imgSrc?: string;
  carouselPhotos?: Array<{ url: string }>;
}

interface AnalysisResult {
  monthlyPayment: number;
  dtiRatio: number;
  affordabilityScore: number;
  affordabilityLevel: 'Affordable' | 'Stretch' | 'Too Expensive';
  advisorMessage: string;
}

interface AnalysisPanelProps {
  property: Property | null;
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
}

function AffordabilityGauge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 70) return '#10b981'; // green
    if (score >= 40) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="transform -rotate-90 w-32 h-32">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke={getColor()}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-neutral-900">{score}</span>
      </div>
    </div>
  );
}

export function AnalysisPanel({ property, analysis, isAnalyzing }: AnalysisPanelProps) {
  if (isAnalyzing) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-neutral-600">Analyzing affordability...</p>
        </div>
      </div>
    );
  }

  if (!analysis || !property) {
    return null;
  }

  const getAffordabilityIcon = () => {
    switch (analysis.affordabilityLevel) {
      case 'Affordable':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Stretch':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'Too Expensive':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getAffordabilityColor = () => {
    switch (analysis.affordabilityLevel) {
      case 'Affordable':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Stretch':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Too Expensive':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full overflow-y-auto"
    >
      {/* Affordability Badge Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 p-4">
        <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border ${getAffordabilityColor()}`}>
          {getAffordabilityIcon()}
          <span className="text-sm font-semibold">{analysis.affordabilityLevel}</span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6 space-y-6 pt-8">
        {/* Property Header */}
        <div>
          <h3 className="text-3xl font-bold text-neutral-900 mb-2">
            ${property.price.toLocaleString()}
          </h3>
          <p className="text-neutral-600 mb-3">{property.address}</p>
          <div className="flex gap-4 text-sm text-neutral-600">
            <span className="font-medium">{property.bedrooms} bed</span>
            <span>•</span>
            <span className="font-medium">{property.bathrooms} bath</span>
            <span>•</span>
            <span className="font-medium">{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Affordability Score */}
        <div className="glass-strong rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            Affordability Score
          </h4>
          <AffordabilityGauge score={analysis.affordabilityScore} />
          <p className="text-center text-sm text-neutral-600 mt-4">
            Based on your income and debt profile
          </p>
        </div>

        {/* Financial Details */}
        <div className="glass-strong rounded-2xl p-6 space-y-4">
          <h4 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary-600" />
            Financial Breakdown
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">Monthly Payment</span>
              <span className="text-lg font-semibold text-neutral-900">
                ${analysis.monthlyPayment.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">Debt-to-Income Ratio</span>
              <span className="text-lg font-semibold text-neutral-900">
                {analysis.dtiRatio.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Sarah's Advisor */}
        <div className="glass-strong rounded-2xl p-6 border-2 border-primary-200">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-neutral-900">Sarah's Advisor</h4>
              <p className="text-xs text-neutral-600">Your AI Home Buying Mentor</p>
            </div>
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {analysis.advisorMessage}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
