'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Share2, X, MessageCircle, DollarSign, AlertTriangle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/homebuyer/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/lib/userProfile';

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

interface Property {
  id: number;
  address: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lat: number;
  lng: number;
  zpid?: string;
  imgSrc?: string;
  carouselPhotos?: Array<{ url: string }>;
  homeType?: string;
  homeStatus?: string;
  daysOnZillow?: number;
  zestimate?: number;
  rentZestimate?: number;
  taxAssessedValue?: number;
  lotAreaValue?: number;
  lotAreaUnit?: string;
  brokerName?: string;
  statusText?: string;
  variableData?: {
    type: string;
    text: string;
  };
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Dropdown states for AI insights sections
  const [expandedSections, setExpandedSections] = useState({
    keyInsights: true,
    warnings: true,
    financial: true,
    advisor: true,
    income: false,
    insurance: false,
    propertyTax: false,
    hoa: false,
    maintenance: false,
    summary: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const propertyId = params.id as string;
    
    fetch('/data/houston_housing_market_2024_100.json')
      .then((res) => res.json())
      .then((data) => {
        const foundProperty = data.find((prop: any) => prop.zpid === propertyId || prop.id === propertyId);
        if (foundProperty) {
          const transformedProperty = {
            id: parseInt(foundProperty.zpid || foundProperty.id),
            address: foundProperty.address,
            addressStreet: foundProperty.addressStreet,
            addressCity: foundProperty.addressCity,
            addressState: foundProperty.addressState,
            addressZipcode: foundProperty.addressZipcode,
            price: foundProperty.unformattedPrice || foundProperty.price,
            bedrooms: foundProperty.beds,
            bathrooms: foundProperty.baths,
            sqft: foundProperty.area,
            lat: foundProperty.latLong.latitude,
            lng: foundProperty.latLong.longitude,
            zpid: foundProperty.zpid,
            imgSrc: foundProperty.imgSrc,
            carouselPhotos: foundProperty.carouselPhotos || [],
            homeType: foundProperty.hdpData?.homeInfo?.homeType || 'SINGLE_FAMILY',
            homeStatus: foundProperty.hdpData?.homeInfo?.homeStatus,
            daysOnZillow: foundProperty.hdpData?.homeInfo?.daysOnZillow,
            zestimate: foundProperty.zestimate,
            rentZestimate: foundProperty.rentZestimate,
            taxAssessedValue: foundProperty.hdpData?.homeInfo?.taxAssessedValue,
            lotAreaValue: foundProperty.hdpData?.homeInfo?.lotAreaValue,
            lotAreaUnit: foundProperty.hdpData?.homeInfo?.lotAreaUnit,
            brokerName: foundProperty.brokerName,
            statusText: foundProperty.statusText,
            variableData: foundProperty.variableData,
          };
          setProperty(transformedProperty);
          
          // Run AI analysis if user is logged in
          if (user) {
            runAIAnalysis(transformedProperty);
          }
        }
      })
      .catch((err) => console.error('Failed to load property:', err));
    
    // Cleanup: Delete data when component unmounts (user navigates away)
    return () => {
      fetch('/api/delete-property-data', { method: 'DELETE' })
        .then(() => console.log('🗑️ Cleanup: Property data deleted'))
        .catch((err) => console.error('❌ Cleanup error:', err));
    };
  }, [params.id, user]);

  const runAIAnalysis = async (prop: Property) => {
    console.log('🔍 Starting AI analysis...');
    console.log('User:', user);
    
    if (!user) {
      console.log('❌ No user logged in');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      console.log('📥 Fetching user profile for:', user.uid);
      // Get user profile from Firestore
      const userProfile = await getUserProfile(user.uid);
      
      if (!userProfile) {
        console.error('❌ User profile not found');
        setAnalysisError('User profile not found. Please complete onboarding.');
        setIsAnalyzing(false);
        return;
      }
      
      console.log('✅ User profile loaded:', userProfile);
      
      // Prepare data for AI
      const propertyData = {
        zpid: prop.zpid || prop.id.toString(),
        price: prop.price,
        address: prop.address,
        addressCity: prop.addressCity,
        addressState: prop.addressState,
        addressZipcode: prop.addressZipcode,
        beds: prop.bedrooms,
        baths: prop.bathrooms,
        area: prop.sqft,
        homeType: prop.homeType,
        daysOnZillow: prop.daysOnZillow,
        zestimate: prop.zestimate,
        rentZestimate: prop.rentZestimate,
        taxAssessedValue: prop.taxAssessedValue,
        lotAreaValue: prop.lotAreaValue,
        lotAreaUnit: prop.lotAreaUnit,
        brokerName: prop.brokerName,
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
      
      console.log('📊 Property data:', propertyData);
      console.log('👤 User data:', userData);
      console.log('🤖 Calling Gemini AI via API...');
      
      // Generate AI insights via API
      const response = await fetch('/api/analyze-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyData, userData }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate AI analysis');
      }
      
      const insights = await response.json();
      console.log('✅ AI insights generated:', insights);
      
      setAiInsights(insights);
      
      // Save all data to Important Data folder
      const fullPropertyData = {
        zpid: prop.zpid || prop.id.toString(),
        address: prop.address,
        addressCity: prop.addressCity,
        addressState: prop.addressState,
        addressZipcode: prop.addressZipcode,
        price: prop.price,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        sqft: prop.sqft,
        lat: prop.lat,
        lng: prop.lng,
        homeType: prop.homeType,
        daysOnZillow: prop.daysOnZillow,
        zestimate: prop.zestimate,
        rentZestimate: prop.rentZestimate,
        taxAssessedValue: prop.taxAssessedValue,
        lotAreaValue: prop.lotAreaValue,
        lotAreaUnit: prop.lotAreaUnit,
        brokerName: prop.brokerName,
      };
      
      const dataToSave = {
        userData: {
          uid: user.uid,
          displayName: userProfile.displayName,
          email: user.email || '',
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
        },
        propertyData: fullPropertyData,
        aiInsights: insights,
      };
      
      // Save to Important Data folder via API
      try {
        const response = await fetch('/api/save-property-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });
        
        if (response.ok) {
          console.log('💾 Data saved to Important Data folder');
        } else {
          console.error('❌ Failed to save data');
        }
      } catch (saveError) {
        console.error('❌ Error saving data:', saveError);
      }
      
    } catch (error: any) {
      console.error('❌ Error running AI analysis:', error);
      setAnalysisError(error.message || 'Failed to generate AI analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const photos = property?.carouselPhotos || [];
  const hasPhotos = photos.length > 0;

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleBackToMap = async () => {
    // Delete property data before navigating back
    try {
      const response = await fetch('/api/delete-property-data', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log('🗑️ Property data deleted from Important Data folder');
      }
    } catch (error) {
      console.error('❌ Error deleting property data:', error);
    }
    
    // Navigate back
    router.back();
  };

  const getAffordabilityColor = () => {
    if (!aiInsights) return 'bg-neutral-100 text-neutral-800';
    switch (aiInsights.affordabilityLevel) {
      case 'Affordable':
        return 'bg-green-100 text-green-800';
      case 'Stretch':
        return 'bg-orange-100 text-orange-800';
      case 'Too Expensive':
        return 'bg-red-100 text-red-800';
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="w-full px-6 py-4 bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToMap}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to search
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={`w-4 h-4 mr-2 ${
                  isFavorite ? 'fill-red-500 text-red-500' : ''
                }`}
              />
              Save
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Image Gallery - Full Width */}
        <div className="relative h-[500px] bg-neutral-900">
          {hasPhotos ? (
            <>
              <motion.img
                key={currentPhotoIndex}
                src={photos[currentPhotoIndex].url}
                alt={`Property photo ${currentPhotoIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6 text-neutral-900" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6 text-neutral-900" />
                  </button>
                </>
              )}

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                {currentPhotoIndex + 1} / {photos.length}
              </div>

              <button className="absolute bottom-6 right-6 px-4 py-2 bg-white hover:bg-neutral-50 rounded-lg text-sm font-medium shadow-lg transition-colors flex items-center gap-2">
                <span className="text-2xl">🖼️</span>
                See all {photos.length} photos
              </button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-neutral-500">No photos available</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex gap-8 px-6 py-8">
          {/* Left Column - Property Details */}
          <div className="flex-1 max-w-3xl">
            {/* Price and Basic Info */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                ${property.price.toLocaleString()}
              </h1>
              <p className="text-lg text-neutral-700 mb-4">{property.address}</p>
              <div className="flex items-center gap-6 text-lg mb-3">
                <span className="font-semibold">{property.bedrooms} beds</span>
                <span className="font-semibold">{property.bathrooms} baths</span>
                <span className="font-semibold">{property.sqft.toLocaleString()} sqft</span>
              </div>
              {property.variableData && (
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  {property.variableData.text}
                </div>
              )}
            </div>

            {/* Estimated Monthly Payment */}
            {aiInsights && (
              <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Est. ${aiInsights.monthlyPayment.toLocaleString()}/mo</p>
                <button className="text-sm text-blue-600 hover:underline">Get pre-qualified</button>
              </div>
            )}

            {/* Property Overview Grid */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Property Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Property Type</p>
                  <p className="font-semibold">{property.homeType?.replace('_', ' ') || 'Single Family'}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Status</p>
                  <p className="font-semibold">{property.statusText || 'For Sale'}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Living Area</p>
                  <p className="font-semibold">{property.sqft.toLocaleString()} sqft</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Lot Size</p>
                  <p className="font-semibold">
                    {property.lotAreaValue 
                      ? `${property.lotAreaValue.toLocaleString()} ${property.lotAreaUnit || 'sqft'}`
                      : '-- sqft'}
                  </p>
                </div>
              </div>
            </div>

            {/* Price & Tax Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Price & Tax Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">List Price</p>
                  <p className="text-2xl font-bold text-neutral-900">${property.price.toLocaleString()}</p>
                </div>
                {property.zestimate && (
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <p className="text-sm text-neutral-600 mb-1">Zestimate®</p>
                    <p className="text-2xl font-bold text-neutral-900">${property.zestimate.toLocaleString()}</p>
                  </div>
                )}
                {property.taxAssessedValue && (
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <p className="text-sm text-neutral-600 mb-1">Tax Assessed Value</p>
                    <p className="text-xl font-semibold text-neutral-900">${property.taxAssessedValue.toLocaleString()}</p>
                  </div>
                )}
                {property.rentZestimate && (
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <p className="text-sm text-neutral-600 mb-1">Rent Zestimate®</p>
                    <p className="text-xl font-semibold text-neutral-900">${property.rentZestimate.toLocaleString()}/mo</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI-Generated Insights */}
            {isAnalyzing && (
              <div className="mb-8 p-8 text-center bg-neutral-50 rounded-xl">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-neutral-600">Generating AI insights...</p>
              </div>
            )}

            {analysisError && !isAnalyzing && (
              <div className="mb-8 p-6 bg-red-50 rounded-xl border-2 border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold text-red-900">AI Analysis Error</h3>
                </div>
                <p className="text-red-700">{analysisError}</p>
                <p className="text-sm text-red-600 mt-2">
                  Please check your Gemini API key or try again later.
                </p>
              </div>
            )}

            {aiInsights && !isAnalyzing && !analysisError && (
              <div className="mb-8 space-y-6">
                <h2 className="text-2xl font-bold text-neutral-900">AI-Powered Analysis</h2>
                
                {/* Affordability Score */}
                <div className={`p-6 rounded-xl ${getAffordabilityColor()}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Affordability Score</h3>
                    <span className="text-3xl font-bold">{aiInsights.affordabilityScore}/100</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                    <div
                      className="bg-current h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${aiInsights.affordabilityScore}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold">{aiInsights.affordabilityLevel}</p>
                </div>

                {/* Key Insights */}
                {aiInsights.keyInsights.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 overflow-hidden">
                    <button
                      onClick={() => toggleSection('keyInsights')}
                      className="w-full p-6 flex items-center justify-between hover:bg-blue-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-neutral-900">Key Insights</h3>
                      </div>
                      {expandedSections.keyInsights ? (
                        <ChevronUp className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                    {expandedSections.keyInsights && (
                      <div className="px-6 pb-6 space-y-2">
                        {aiInsights.keyInsights.map((insight, index) => (
                          <p key={index} className="text-neutral-700 text-sm leading-relaxed">
                            {insight}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Warnings */}
                {aiInsights.warnings.length > 0 && (
                  <div className="bg-orange-50 rounded-xl border-2 border-orange-200 overflow-hidden">
                    <button
                      onClick={() => toggleSection('warnings')}
                      className="w-full p-6 flex items-center justify-between hover:bg-orange-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                        <h3 className="text-xl font-bold text-neutral-900">Important Considerations</h3>
                      </div>
                      {expandedSections.warnings ? (
                        <ChevronUp className="w-5 h-5 text-orange-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-orange-600" />
                      )}
                    </button>
                    {expandedSections.warnings && (
                      <div className="px-6 pb-6 space-y-2">
                        {aiInsights.warnings.map((warning, index) => (
                          <p key={index} className="text-neutral-700 text-sm leading-relaxed">
                            {warning}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Financial Breakdown */}
                <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                  <button
                    onClick={() => toggleSection('financial')}
                    className="w-full p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-neutral-900">Financial Breakdown</h3>
                    </div>
                    {expandedSections.financial ? (
                      <ChevronUp className="w-5 h-5 text-neutral-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-600" />
                    )}
                  </button>
                  {expandedSections.financial && (
                    <div className="px-6 pb-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Monthly Payment</span>
                        <span className="text-xl font-bold text-green-600">
                          ${aiInsights.monthlyPayment.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">DTI Ratio</span>
                        <span className="font-semibold">{aiInsights.dtiRatio.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Down Payment Needed</span>
                        <span className="font-semibold">${aiInsights.financialBreakdown.downPaymentNeeded.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Closing Costs</span>
                        <span className="font-semibold">${aiInsights.financialBreakdown.closingCosts.toLocaleString()}</span>
                      </div>
                      <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
                        <span className="font-bold text-neutral-900">Total Cash Needed</span>
                        <span className="text-2xl font-bold text-green-600">
                          ${aiInsights.financialBreakdown.totalCashNeeded.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* HomePilot's Advisor Message */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 overflow-hidden">
                  <button
                    onClick={() => toggleSection('advisor')}
                    className="w-full p-6 flex items-center justify-between hover:bg-purple-100/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-xl">🏠</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-neutral-900">HomePilot Advisor</h4>
                        <p className="text-xs text-neutral-600">Your AI Home Buying Mentor</p>
                      </div>
                    </div>
                    {expandedSections.advisor ? (
                      <ChevronUp className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                  {expandedSections.advisor && (
                    <div className="px-6 pb-6">
                      <p className="text-neutral-700 leading-relaxed">
                        {aiInsights.advisorMessage}
                      </p>
                    </div>
                  )}
                </div>

                {/* 5-Year Cost Projections */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">5-Year Cost Projections</h2>
                  
                  {/* Income Breakdown */}
                  <div className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 overflow-hidden">
                    <button
                      onClick={() => toggleSection('income')}
                      className="w-full p-6 flex items-center justify-between hover:bg-green-100/50 transition-colors"
                    >
                      <h3 className="text-xl font-bold text-neutral-900">💰 Income Breakdown</h3>
                      {expandedSections.income ? (
                        <ChevronUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-green-600" />
                      )}
                    </button>
                    {expandedSections.income && (
                    <div className="px-6 pb-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-700">Monthly Gross Income</span>
                        <span className="text-lg font-bold text-green-700">
                          ${aiInsights.incomeBreakdown.monthlyGrossIncome.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-700">Monthly Net Income (after tax)</span>
                        <span className="text-lg font-semibold text-green-600">
                          ${aiInsights.incomeBreakdown.monthlyNetIncome.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-700">After Housing Payment</span>
                        <span className="text-lg font-semibold text-neutral-900">
                          ${aiInsights.incomeBreakdown.afterHousingIncome.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-green-200 flex justify-between items-center">
                        <span className="font-bold text-neutral-900">Housing-to-Income Ratio</span>
                        <span className="text-2xl font-bold text-green-700">
                          {aiInsights.incomeBreakdown.housingToIncomeRatio.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    )}
                  </div>

                  {/* Insurance Breakdown */}
                  <div className="mb-6 bg-white rounded-xl border border-neutral-200 overflow-hidden">
                    <button
                      onClick={() => toggleSection('insurance')}
                      className="w-full p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                    >
                      <h3 className="text-xl font-bold text-neutral-900">🏠 Homeowners Insurance (5-Year Projection)</h3>
                      {expandedSections.insurance ? (
                        <ChevronUp className="w-5 h-5 text-neutral-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-600" />
                      )}
                    </button>
                    {expandedSections.insurance && (
                    <div className="px-6 pb-6">
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 1</p>
                        <p className="font-bold text-neutral-900">${aiInsights.insuranceBreakdown.year1.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 2</p>
                        <p className="font-bold text-neutral-900">${aiInsights.insuranceBreakdown.year2.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 3</p>
                        <p className="font-bold text-neutral-900">${aiInsights.insuranceBreakdown.year3.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 4</p>
                        <p className="font-bold text-neutral-900">${aiInsights.insuranceBreakdown.year4.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 5</p>
                        <p className="font-bold text-neutral-900">${aiInsights.insuranceBreakdown.year5.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-700">Total 5-Year Cost</span>
                        <span className="text-xl font-bold text-blue-600">
                          ${aiInsights.insuranceBreakdown.total5Years.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-700">Average Monthly</span>
                        <span className="font-semibold text-neutral-900">
                          ${aiInsights.insuranceBreakdown.averageMonthly.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                      {aiInsights.insuranceBreakdown.notes}
                    </p>
                    </div>
                    )}
                  </div>

                  {/* Property Tax Breakdown */}
                  <div className="mb-6 bg-white rounded-xl border border-neutral-200 overflow-hidden">
                    <button
                      onClick={() => toggleSection('propertyTax')}
                      className="w-full p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                    >
                      <h3 className="text-xl font-bold text-neutral-900">🏛️ Property Taxes (5-Year Projection)</h3>
                      {expandedSections.propertyTax ? (
                        <ChevronUp className="w-5 h-5 text-neutral-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-600" />
                      )}
                    </button>
                    {expandedSections.propertyTax && (
                    <div className="px-6 pb-6">
                    <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-neutral-700">Zip Code: {aiInsights.propertyTaxBreakdown.zipCode}</span>
                        <span className="text-sm font-semibold text-orange-700">
                          Effective Rate: {aiInsights.propertyTaxBreakdown.effectiveRate}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-700">Annual Tax</span>
                        <span className="text-lg font-bold text-orange-600">
                          ${aiInsights.propertyTaxBreakdown.annualTax.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 1</p>
                        <p className="font-bold text-neutral-900">${aiInsights.propertyTaxBreakdown.year1.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 2</p>
                        <p className="font-bold text-neutral-900">${aiInsights.propertyTaxBreakdown.year2.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 3</p>
                        <p className="font-bold text-neutral-900">${aiInsights.propertyTaxBreakdown.year3.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 4</p>
                        <p className="font-bold text-neutral-900">${aiInsights.propertyTaxBreakdown.year4.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 5</p>
                        <p className="font-bold text-neutral-900">${aiInsights.propertyTaxBreakdown.year5.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-neutral-900">Total 5-Year Cost</span>
                      <span className="text-xl font-bold text-orange-600">
                        ${aiInsights.propertyTaxBreakdown.total5Years.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                      {aiInsights.propertyTaxBreakdown.notes}
                    </p>
                    </div>
                    )}
                  </div>

                  {/* HOA Fees Breakdown */}
                  <div className="mb-6 bg-white rounded-xl border border-neutral-200 overflow-hidden">
                    <button
                      onClick={() => toggleSection('hoa')}
                      className="w-full p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                    >
                      <h3 className="text-xl font-bold text-neutral-900">🏘️ HOA Fees (5-Year Projection)</h3>
                      {expandedSections.hoa ? (
                        <ChevronUp className="w-5 h-5 text-neutral-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-600" />
                      )}
                    </button>
                    {expandedSections.hoa && (
                    <div className="px-6 pb-6">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-neutral-700">Monthly HOA Fee</span>
                        <span className="text-lg font-bold text-purple-600">
                          ${aiInsights.hoaFeesBreakdown.monthlyFee.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 1</p>
                        <p className="font-bold text-neutral-900">${aiInsights.hoaFeesBreakdown.year1.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 2</p>
                        <p className="font-bold text-neutral-900">${aiInsights.hoaFeesBreakdown.year2.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 3</p>
                        <p className="font-bold text-neutral-900">${aiInsights.hoaFeesBreakdown.year3.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 4</p>
                        <p className="font-bold text-neutral-900">${aiInsights.hoaFeesBreakdown.year4.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 5</p>
                        <p className="font-bold text-neutral-900">${aiInsights.hoaFeesBreakdown.year5.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-neutral-900">Total 5-Year Cost</span>
                      <span className="text-xl font-bold text-purple-600">
                        ${aiInsights.hoaFeesBreakdown.total5Years.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                      {aiInsights.hoaFeesBreakdown.notes}
                    </p>
                    </div>
                    )}
                  </div>

                  {/* Maintenance Breakdown */}
                  <div className="mb-6 bg-white rounded-xl border border-neutral-200 overflow-hidden">
                    <button
                      onClick={() => toggleSection('maintenance')}
                      className="w-full p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                    >
                      <h3 className="text-xl font-bold text-neutral-900">🔧 Maintenance Costs (5-Year Projection)</h3>
                      {expandedSections.maintenance ? (
                        <ChevronUp className="w-5 h-5 text-neutral-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neutral-600" />
                      )}
                    </button>
                    {expandedSections.maintenance && (
                    <div className="px-6 pb-6">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-neutral-700">Monthly Reserve Recommended</span>
                        <span className="text-lg font-bold text-amber-600">
                          ${aiInsights.maintenanceBreakdown.monthlyReserve.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 1</p>
                        <p className="font-bold text-neutral-900">${aiInsights.maintenanceBreakdown.year1.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 2</p>
                        <p className="font-bold text-neutral-900">${aiInsights.maintenanceBreakdown.year2.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 3</p>
                        <p className="font-bold text-neutral-900">${aiInsights.maintenanceBreakdown.year3.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 4</p>
                        <p className="font-bold text-neutral-900">${aiInsights.maintenanceBreakdown.year4.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-xs text-neutral-600 mb-1">Year 5</p>
                        <p className="font-bold text-neutral-900">${aiInsights.maintenanceBreakdown.year5.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-neutral-900">Total 5-Year Cost</span>
                      <span className="text-xl font-bold text-amber-600">
                        ${aiInsights.maintenanceBreakdown.total5Years.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                      {aiInsights.maintenanceBreakdown.notes}
                    </p>
                    </div>
                    )}
                  </div>

                  {/* Total 5-Year Summary */}
                  <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection('summary')}
                      className="w-full p-6 flex items-center justify-between hover:bg-neutral-800 transition-colors"
                    >
                      <h3 className="text-xl font-bold">📊 Total 5-Year Ownership Costs</h3>
                      {expandedSections.summary ? (
                        <ChevronUp className="w-5 h-5 text-white" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white" />
                      )}
                    </button>
                    {expandedSections.summary && (
                    <div className="px-6 pb-6 space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b border-white/20">
                        <span>Insurance</span>
                        <span className="font-semibold">${aiInsights.insuranceBreakdown.total5Years.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-white/20">
                        <span>Property Taxes</span>
                        <span className="font-semibold">${aiInsights.propertyTaxBreakdown.total5Years.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-white/20">
                        <span>HOA Fees</span>
                        <span className="font-semibold">${aiInsights.hoaFeesBreakdown.total5Years.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-white/20">
                        <span>Maintenance</span>
                        <span className="font-semibold">${aiInsights.maintenanceBreakdown.total5Years.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3">
                        <span className="text-xl font-bold">Grand Total</span>
                        <span className="text-3xl font-bold text-green-400">
                          ${(
                            aiInsights.insuranceBreakdown.total5Years +
                            aiInsights.propertyTaxBreakdown.total5Years +
                            aiInsights.hoaFeesBreakdown.total5Years +
                            aiInsights.maintenanceBreakdown.total5Years
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Listing Information */}
            <div className="mb-8 p-6 bg-neutral-50 rounded-lg border border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Listing Information</h2>
              <div className="space-y-3">
                {property.brokerName && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Listed by</span>
                    <span className="font-semibold text-neutral-900">{property.brokerName}</span>
                  </div>
                )}
                {property.daysOnZillow !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Days on Zillow</span>
                    <span className="font-semibold text-neutral-900">{property.daysOnZillow} days</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-600">Property ID</span>
                  <span className="font-semibold text-neutral-900">{property.zpid}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact HomePilot */}
          <div className="w-80 shrink-0">
            <div className="sticky top-24">
              <Button
                variant="outline"
                className="w-full py-6 text-lg font-semibold"
                size="lg"
                onClick={() => setShowChat(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact HomePilot
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface Overlay */}
      <AnimatePresence>
        {showChat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowChat(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-50"
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <h3 className="text-lg font-semibold">Chat with HomePilot</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ChatInterface />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
