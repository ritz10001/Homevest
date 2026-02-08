'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, GitCompare, X, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/homebuyer/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/userProfile';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues
const DynamicPropertyMap = dynamic(
  () => import('@/components/homebuyer/PropertyMapComparison').then((mod) => mod.PropertyMap),
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
  zpid?: string;
  imgSrc?: string;
  carouselPhotos?: Array<{ url: string }>;
}

export default function HomebuyerMapDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Comparison mode state
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [comparisonAnalysis, setComparisonAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showComparisonPanel, setShowComparisonPanel] = useState(false);

  useEffect(() => {
    // Load Houston properties from the data folder
    fetch('/data/houston_housing_market_2024_100.json')
      .then((res) => res.json())
      .then((data) => {
        // Transform the data to match our Property interface
        const transformedProperties = data.map((prop: any) => ({
          id: parseInt(prop.zpid || prop.id),
          address: prop.address,
          price: prop.unformattedPrice || prop.price,
          bedrooms: prop.beds,
          bathrooms: prop.baths,
          sqft: prop.area,
          lat: prop.latLong.latitude,
          lng: prop.latLong.longitude,
          zpid: prop.zpid,
          imgSrc: prop.imgSrc,
          carouselPhotos: prop.carouselPhotos || [],
        }));
        setProperties(transformedProperties);
      })
      .catch((err) => console.error('Failed to load properties:', err));
  }, []);

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseCard = () => {
    setSelectedProperty(null);
  };

  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    if (comparisonMode) {
      // Exiting comparison mode - reset
      setSelectedForComparison([]);
      setComparisonAnalysis(null);
      setShowComparisonPanel(false);
    }
  };

  const handlePropertyComparisonSelect = (zpid: string) => {
    if (!comparisonMode) return;
    
    setSelectedForComparison(prev => {
      if (prev.includes(zpid)) {
        // Deselect
        return prev.filter(id => id !== zpid);
      } else if (prev.length < 3) {
        // Select (max 3)
        return [...prev, zpid];
      }
      return prev;
    });
  };

  const runComparison = async () => {
    if (selectedForComparison.length < 2 || !user) return;
    
    setIsAnalyzing(true);
    setShowComparisonPanel(true);
    
    try {
      // Get user profile
      const userProfile = await getUserProfile(user.uid);
      if (!userProfile) {
        throw new Error('User profile not found');
      }
      
      // Get full property data and AI insights for selected properties
      const selectedPropertiesData = await Promise.all(
        selectedForComparison.map(async (zpid) => {
          const property = properties.find(p => p.zpid === zpid);
          if (!property) return null;
          
          // Fetch AI insights for this property
          const propertyData = {
            zpid: property.zpid,
            price: property.price,
            address: property.address,
            addressCity: '', // You may need to parse this
            addressState: '',
            addressZipcode: '',
            beds: property.bedrooms,
            baths: property.bathrooms,
            area: property.sqft,
          };
          
          const userData = {
            displayName: userProfile.displayName,
            annualIncome: userProfile.annualIncome,
            monthlyDebt: userProfile.monthlyDebt,
            availableSavings: userProfile.availableSavings,
            maxMonthlyBudget: userProfile.maxMonthlyBudget,
            downPayment: userProfile.downPayment,
            interestRate: userProfile.interestRate,
            loanTerm: userProfile.loanTerm,
            includePMI: userProfile.includePMI,
            creditScore: userProfile.creditScore,
            riskComfort: userProfile.riskComfort,
            timeHorizon: userProfile.timeHorizon,
          };
          
          // Get AI insights
          const aiResponse = await fetch('/api/analyze-property', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ propertyData, userData }),
          });
          
          const aiInsights = aiResponse.ok ? await aiResponse.json() : null;
          
          return {
            propertyData,
            aiInsights,
          };
        })
      );
      
      const validProperties = selectedPropertiesData.filter(p => p !== null);
      
      // Call comparison API
      const comparisonResponse = await fetch('/api/compare-properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userData: {
            displayName: userProfile.displayName,
            annualIncome: userProfile.annualIncome,
            monthlyDebt: userProfile.monthlyDebt,
            availableSavings: userProfile.availableSavings,
            maxMonthlyBudget: userProfile.maxMonthlyBudget,
            downPayment: userProfile.downPayment,
            interestRate: userProfile.interestRate,
            creditScore: userProfile.creditScore,
            riskComfort: userProfile.riskComfort,
            timeHorizon: userProfile.timeHorizon,
          },
          properties: validProperties,
        }),
      });
      
      if (!comparisonResponse.ok) {
        throw new Error('Failed to generate comparison');
      }
      
      const analysis = await comparisonResponse.json();
      setComparisonAnalysis(analysis);
    } catch (error) {
      console.error('Comparison error:', error);
      alert('Failed to generate comparison. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!comparisonAnalysis) return;
    
    const reportData = {
      generatedAt: new Date().toISOString(),
      user: user?.displayName || 'User',
      properties: selectedForComparison.map(zpid => {
        const prop = properties.find(p => p.zpid === zpid);
        return {
          zpid,
          address: prop?.address,
          price: prop?.price,
        };
      }),
      analysis: comparisonAnalysis,
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `property-comparison-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter properties for comparison mode
  const displayedProperties = comparisonMode && selectedForComparison.length > 0
    ? properties.filter(p => selectedForComparison.includes(p.zpid || ''))
    : properties;

  // Calculate center point for selected properties
  const mapCenter = comparisonMode && selectedForComparison.length > 0
    ? (() => {
        const selected = properties.filter(p => selectedForComparison.includes(p.zpid || ''));
        const avgLat = selected.reduce((sum, p) => sum + p.lat, 0) / selected.length;
        const avgLng = selected.reduce((sum, p) => sum + p.lng, 0) / selected.length;
        return { lat: avgLat, lng: avgLng };
      })()
    : undefined;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Navbar */}
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
          
          {/* Comparison Mode Toggle */}
          <Button
            variant={comparisonMode ? "default" : "outline"}
            size="sm"
            onClick={toggleComparisonMode}
            className="gap-2"
          >
            <GitCompare className="w-4 h-4" />
            {comparisonMode ? 'Exit Compare' : 'Compare'}
          </Button>
        </div>
      </nav>

      {/* Map Container - Full Screen with Overlays */}
      <div className="flex-1 relative flex">
        {/* Map Section */}
        <div className={`${showComparisonPanel ? 'w-1/2' : 'w-full'} relative transition-all duration-300`}>
          <div className="absolute inset-0">
            <DynamicPropertyMap
              properties={displayedProperties}
              onPropertySelect={comparisonMode ? (prop) => handlePropertyComparisonSelect(prop.zpid || '') : handlePropertySelect}
              selectedProperty={selectedProperty}
              center={mapCenter}
              comparisonMode={comparisonMode}
              selectedForComparison={selectedForComparison}
            />
          </div>

          {/* Search Bar Overlay - Top Center */}
          {!comparisonMode && (
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
          )}

          {/* Comparison Mode Instructions */}
          {comparisonMode && selectedForComparison.length < 2 && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg border border-neutral-200">
              <p className="text-sm text-neutral-700">
                Select {selectedForComparison.length === 0 ? '2-3' : selectedForComparison.length === 1 ? '1-2 more' : '1 more'} properties to compare
              </p>
            </div>
          )}

          {/* Compare Button */}
          {comparisonMode && selectedForComparison.length >= 2 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
              <Button
                onClick={runComparison}
                size="lg"
                className="shadow-lg"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare {selectedForComparison.length} Properties
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Property Card Overlay - Bottom Center (Zillow-style) */}
          <AnimatePresence>
            {selectedProperty && !comparisonMode && (
              <PropertyCard
                property={selectedProperty}
                onClose={handleCloseCard}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Comparison Analysis Panel - Right Side */}
        <AnimatePresence>
          {showComparisonPanel && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-1/2 bg-white border-l border-neutral-200 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">Property Comparison</h2>
                  <div className="flex items-center gap-2">
                    {comparisonAnalysis && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadReport}
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Report
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComparisonPanel(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Loading State */}
                {isAnalyzing && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                    <p className="text-neutral-600">Analyzing properties with AI...</p>
                  </div>
                )}

                {/* Analysis Results */}
                {comparisonAnalysis && !isAnalyzing && (
                  <div className="space-y-6">
                    {/* Recommendation */}
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-white text-xl">🏆</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-neutral-900">Recommended Property</h3>
                          <p className="text-sm text-neutral-600">
                            {properties.find(p => p.zpid === comparisonAnalysis.recommendation.bestProperty)?.address}
                          </p>
                        </div>
                      </div>
                      <p className="text-neutral-700 leading-relaxed mb-3">
                        {comparisonAnalysis.recommendation.reason}
                      </p>
                      <div className="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
                        {comparisonAnalysis.recommendation.confidenceLevel} Confidence
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200">
                      <h3 className="text-lg font-bold text-neutral-900 mb-3">Executive Summary</h3>
                      <p className="text-neutral-700 leading-relaxed">
                        {comparisonAnalysis.summary}
                      </p>
                    </div>

                    {/* Property Breakdown */}
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-4">Property Breakdown</h3>
                      <div className="space-y-4">
                        {comparisonAnalysis.propertyBreakdown.map((prop: any) => (
                          <div key={prop.zpid} className="p-4 bg-white rounded-xl border border-neutral-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-neutral-900">{prop.address}</h4>
                              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold">
                                {prop.score}/100
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs font-semibold text-green-600 mb-2">PROS</p>
                                <ul className="space-y-1">
                                  {prop.pros.map((pro: string, idx: number) => (
                                    <li key={idx} className="text-sm text-neutral-700">✓ {pro}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-orange-600 mb-2">CONS</p>
                                <ul className="space-y-1">
                                  {prop.cons.map((con: string, idx: number) => (
                                    <li key={idx} className="text-sm text-neutral-700">✗ {con}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Factors */}
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <h3 className="text-lg font-bold text-neutral-900 mb-3">Key Decision Factors</h3>
                      <ul className="space-y-2">
                        {comparisonAnalysis.keyFactors.map((factor: string, idx: number) => (
                          <li key={idx} className="text-sm text-neutral-700 flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Next Steps */}
                    <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                      <h3 className="text-lg font-bold text-neutral-900 mb-3">Next Steps</h3>
                      <ol className="space-y-2">
                        {comparisonAnalysis.nextSteps.map((step: string, idx: number) => (
                          <li key={idx} className="text-sm text-neutral-700 flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
