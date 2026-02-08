'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisPanel } from '@/components/homebuyer/AnalysisPanel';
import { ChatInterface } from '@/components/homebuyer/ChatInterface';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues
const DynamicPropertyMap = dynamic(
  () => import('@/components/homebuyer/PropertyMap').then((mod) => mod.PropertyMap),
  { ssr: false }
);

interface Property {
  id: number;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lat: number;
  lng: number;
}

interface AnalysisResult {
  monthlyPayment: number;
  dtiRatio: number;
  affordabilityScore: number;
  affordabilityLevel: 'Affordable' | 'Stretch' | 'Too Expensive';
  advisorMessage: string;
}

// Mock user profile - in production, fetch from Firestore
const userProfile = {
  income: 85000,
  monthlyDebt: 800,
};

export default function HomebuyerMapDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load properties
    fetch('/properties.json')
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error('Failed to load properties:', err));
  }, []);

  const analyzeProperty = async (property: Property) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis - in production, call Vercel AI SDK
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Calculate mortgage (assuming 20% down, 7% interest, 30 years)
    const downPayment = property.price * 0.2;
    const loanAmount = property.price - downPayment;
    const monthlyRate = 0.07 / 12;
    const numPayments = 30 * 12;
    const monthlyPayment = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
    );

    // Calculate DTI
    const monthlyIncome = userProfile.income / 12;
    const totalMonthlyDebt = userProfile.monthlyDebt + monthlyPayment;
    const dtiRatio = (totalMonthlyDebt / monthlyIncome) * 100;

    // Calculate affordability score (0-100)
    let affordabilityScore = 100;
    if (dtiRatio > 43) affordabilityScore = Math.max(0, 100 - (dtiRatio - 43) * 3);
    else if (dtiRatio > 36) affordabilityScore = 70 + ((43 - dtiRatio) / 7) * 30;
    else affordabilityScore = 70 + ((36 - dtiRatio) / 36) * 30;
    affordabilityScore = Math.round(Math.min(100, Math.max(0, affordabilityScore)));

    // Determine affordability level
    let affordabilityLevel: 'Affordable' | 'Stretch' | 'Too Expensive';
    let advisorMessage: string;

    if (affordabilityScore >= 70) {
      affordabilityLevel = 'Affordable';
      advisorMessage = `Great news! This home fits comfortably within your budget. With a DTI of ${dtiRatio.toFixed(1)}%, you'll have plenty of breathing room for other expenses and savings. Your monthly payment of $${monthlyPayment.toLocaleString()} leaves you with financial flexibility to enjoy your new home without stress.`;
    } else if (affordabilityScore >= 40) {
      affordabilityLevel = 'Stretch';
      advisorMessage = `This home is a bit of a stretch, but it's doable with careful budgeting. Your DTI of ${dtiRatio.toFixed(1)}% is on the higher side, which means you'll need to be mindful of your spending. Consider building a larger emergency fund before committing, and make sure you're comfortable with the monthly payment of $${monthlyPayment.toLocaleString()}.`;
    } else {
      affordabilityLevel = 'Too Expensive';
      advisorMessage = `I'd recommend looking at more affordable options. With a DTI of ${dtiRatio.toFixed(1)}%, this home would put significant strain on your finances. A monthly payment of $${monthlyPayment.toLocaleString()} could leave you vulnerable to unexpected expenses. Let's find something that gives you more financial security and peace of mind.`;
    }

    setAnalysis({
      monthlyPayment,
      dtiRatio,
      affordabilityScore,
      affordabilityLevel,
      advisorMessage,
    });
    setIsAnalyzing(false);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    analyzeProperty(property);
  };

  const handleClosePanel = () => {
    setSelectedProperty(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Navbar - Same as landing page */}
      <nav className="w-full px-6 md:px-12 py-4 glass-strong sticky top-0 z-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-xl font-display">
                H
              </span>
            </div>
            <span className="text-2xl font-bold font-display text-gradient-primary">
              Homevest
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <a href="/">Home</a>
            </Button>
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Button variant="ghost" size="sm">
              Features
            </Button>
          </div>
        </div>
      </nav>

      {/* Map Container - Full Screen with Overlays */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <DynamicPropertyMap
            properties={properties}
            onPropertySelect={handlePropertySelect}
            selectedProperty={selectedProperty}
          />
        </div>

        {/* Search Bar Overlay - Top Center */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <div className="relative w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search by city, neighborhood, or ZIP code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/95 backdrop-blur-sm border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-lg"
            />
          </div>
        </div>

        {/* Left Panel - Property Details & Analysis */}
        <AnimatePresence>
          {selectedProperty && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 left-0 h-full w-[400px] bg-white shadow-2xl z-30 overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={handleClosePanel}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-neutral-100 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>

              <AnalysisPanel
                property={selectedProperty}
                analysis={analysis}
                isAnalyzing={isAnalyzing}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Panel - Chat Interface */}
        <AnimatePresence>
          {selectedProperty && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-30"
            >
              <ChatInterface />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
