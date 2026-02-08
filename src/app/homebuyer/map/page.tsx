'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { Search, GitCompare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/homebuyer/PropertyCard';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';

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
  zpid?: string;
  imgSrc?: string;
  carouselPhotos?: Array<{ url: string }>;
}

export default function HomebuyerMapDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]); // Store all properties
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Comparison mode state
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<Property[]>([]);
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000000 });
  const [maxPrice, setMaxPrice] = useState(2000000);

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
        
        // Store all properties
        setAllProperties(transformedProperties);
        
        // Calculate price range
        const prices = transformedProperties.map((p: Property) => p.price);
        const minPrice = Math.min(...prices);
        const maxPriceValue = Math.max(...prices);
        
        setPriceRange({ min: minPrice, max: maxPriceValue });
        setMaxPrice(maxPriceValue);
        
        // Initially show all properties
        setProperties(transformedProperties);
      })
      .catch((err) => console.error('Failed to load properties:', err));
  }, []);
  
  // Filter properties when max price changes
  useEffect(() => {
    const filtered = allProperties.filter(prop => prop.price <= maxPrice);
    setProperties(filtered);
    console.log(`🔍 Filtered properties: ${filtered.length}/${allProperties.length} (max price: $${maxPrice.toLocaleString()})`);
  }, [maxPrice, allProperties]);

  const handlePropertySelect = (property: Property) => {
    if (compareMode) {
      // In compare mode, toggle selection
      const isAlreadySelected = selectedForCompare.some(p => p.id === property.id);
      
      if (isAlreadySelected) {
        // Deselect
        setSelectedForCompare(prev => prev.filter(p => p.id !== property.id));
      } else {
        // Select (max 3 properties)
        if (selectedForCompare.length < 3) {
          setSelectedForCompare(prev => [...prev, property]);
        } else {
          alert('You can compare up to 3 properties at a time');
        }
      }
    } else {
      // Normal mode - show property card
      setSelectedProperty(property);
    }
  };

  const handleCloseCard = () => {
    setSelectedProperty(null);
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (compareMode) {
      // Turning off compare mode - clear selections
      setSelectedForCompare([]);
    }
  };

  const removeFromCompare = (propertyId: number) => {
    setSelectedForCompare(prev => prev.filter(p => p.id !== propertyId));
  };

  const handleCompare = async () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 properties to compare');
      return;
    }

    if (!user) {
      alert('Please sign in to use the comparison feature');
      return;
    }

    setIsLoadingComparison(true);

    try {
      console.log('🔍 Step 1: Loading user data from Firebase...');
      
      // Step 1: Get user profile from Firestore (client-side)
      const { getUserProfile } = await import('@/lib/userProfile');
      const userProfile = await getUserProfile(user.uid);
      
      if (!userProfile) {
        throw new Error('User profile not found. Please complete onboarding.');
      }
      
      console.log('✅ User data loaded:', userProfile);

      // Prepare user data for comparison
      const userData = {
        uid: user.uid,
        displayName: userProfile.displayName,
        email: user.email || '',
        mode: userProfile.mode, // Add mode field
        // Homebuyer fields
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
        // Investor fields (may be undefined for homebuyers)
        availableCapital: (userProfile as any).availableCapital,
        downPaymentPercent: (userProfile as any).downPaymentPercent,
        targetLoanTerm: (userProfile as any).targetLoanTerm,
        estimatedInterestRate: (userProfile as any).estimatedInterestRate,
        targetCashFlow: (userProfile as any).targetCashFlow,
        targetROI: (userProfile as any).targetROI,
        holdPeriod: (userProfile as any).holdPeriod,
        riskTolerance: (userProfile as any).riskTolerance,
        vacancyRate: (userProfile as any).vacancyRate,
        maintenancePercent: (userProfile as any).maintenancePercent,
        experienceLevel: (userProfile as any).experienceLevel,
      };

      console.log('🏠 Step 2: Processing properties and generating AI insights...');
      
      // Step 2 & 3: For each property, load data and generate AI insights
      const comparisonProperties = [];
      
      for (let i = 0; i < selectedForCompare.length; i++) {
        const property = selectedForCompare[i];
        console.log(`\n📊 Processing Property ${i + 1}/${selectedForCompare.length}: ${property.address}`);
        
        // Load full property data from the original JSON
        const propertyResponse = await fetch('/data/houston_housing_market_2024_100.json');
        const allProperties = await propertyResponse.json();
        const fullPropertyData = allProperties.find((p: any) => 
          p.zpid === property.zpid || p.id === property.id.toString()
        );
        
        if (!fullPropertyData) {
          console.error(`❌ Property ${property.id} not found in data`);
          continue;
        }
        
        console.log(`✅ Property data loaded for: ${property.address}`);
        
        // Prepare property data for AI analysis
        const propertyDataForAI = {
          zpid: fullPropertyData.zpid || fullPropertyData.id,
          price: fullPropertyData.unformattedPrice || fullPropertyData.price,
          address: fullPropertyData.address,
          addressCity: fullPropertyData.addressCity,
          addressState: fullPropertyData.addressState,
          addressZipcode: fullPropertyData.addressZipcode,
          beds: fullPropertyData.beds,
          baths: fullPropertyData.baths,
          area: fullPropertyData.area,
          homeType: fullPropertyData.hdpData?.homeInfo?.homeType || 'SINGLE_FAMILY',
          daysOnZillow: fullPropertyData.hdpData?.homeInfo?.daysOnZillow,
          zestimate: fullPropertyData.zestimate,
          rentZestimate: fullPropertyData.rentZestimate,
          taxAssessedValue: fullPropertyData.hdpData?.homeInfo?.taxAssessedValue,
          lotAreaValue: fullPropertyData.hdpData?.homeInfo?.lotAreaValue,
          lotAreaUnit: fullPropertyData.hdpData?.homeInfo?.lotAreaUnit,
          brokerName: fullPropertyData.brokerName,
        };
        
        const userDataForAI = {
          displayName: userProfile.displayName,
          mode: userProfile.mode, // Add mode field
          // Homebuyer fields
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
          // Investor fields (may be undefined for homebuyers)
          availableCapital: (userProfile as any).availableCapital,
          downPaymentPercent: (userProfile as any).downPaymentPercent,
          targetLoanTerm: (userProfile as any).targetLoanTerm,
          estimatedInterestRate: (userProfile as any).estimatedInterestRate,
          targetCashFlow: (userProfile as any).targetCashFlow,
          targetROI: (userProfile as any).targetROI,
          holdPeriod: (userProfile as any).holdPeriod,
          riskTolerance: (userProfile as any).riskTolerance,
        };
        
        console.log(`🤖 Generating AI insights for Property ${i + 1}...`);
        
        // Step 3: Generate AI insights using existing algorithm
        const aiResponse = await fetch('/api/analyze-property', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            propertyData: propertyDataForAI, 
            userData: userDataForAI 
          }),
        });

        if (!aiResponse.ok) {
          const errorData = await aiResponse.json();
          console.error(`❌ AI analysis failed for property ${property.id}:`, errorData);
          throw new Error(`Failed to generate AI insights for property ${property.address}`);
        }

        const aiInsights = await aiResponse.json();
        console.log(`✅ AI insights generated for Property ${i + 1}`);

        // Combine all data for this property
        comparisonProperties.push({
          propertyData: {
            zpid: fullPropertyData.zpid || fullPropertyData.id,
            address: fullPropertyData.address,
            addressCity: fullPropertyData.addressCity,
            addressState: fullPropertyData.addressState,
            addressZipcode: fullPropertyData.addressZipcode,
            price: fullPropertyData.unformattedPrice || fullPropertyData.price,
            bedrooms: fullPropertyData.beds,
            bathrooms: fullPropertyData.baths,
            sqft: fullPropertyData.area,
            lat: fullPropertyData.latLong.latitude,
            lng: fullPropertyData.latLong.longitude,
            homeType: fullPropertyData.hdpData?.homeInfo?.homeType,
            daysOnZillow: fullPropertyData.hdpData?.homeInfo?.daysOnZillow,
            zestimate: fullPropertyData.zestimate,
            rentZestimate: fullPropertyData.rentZestimate,
            taxAssessedValue: fullPropertyData.hdpData?.homeInfo?.taxAssessedValue,
            lotAreaValue: fullPropertyData.hdpData?.homeInfo?.lotAreaValue,
            lotAreaUnit: fullPropertyData.hdpData?.homeInfo?.lotAreaUnit,
            brokerName: fullPropertyData.brokerName,
            imgSrc: fullPropertyData.imgSrc,
            carouselPhotos: fullPropertyData.carouselPhotos,
          },
          aiInsights: aiInsights,
        });
      }

      console.log('💾 Step 4: Saving comparison data...');
      
      // Step 4: Save all data to comparison_data.json
      const comparisonData = {
        userData: userData,
        properties: comparisonProperties,
      };
      
      const saveResponse = await fetch('/api/save-comparison-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comparisonData),
      });

      if (saveResponse.ok) {
        console.log('✅ Comparison data saved successfully!');
        // Navigate to comparison view
        router.push('/homebuyer/compare');
      } else {
        throw new Error('Failed to save comparison data');
      }
    } catch (error: any) {
      console.error('❌ Error creating comparison:', error);
      alert(`Failed to create comparison: ${error.message}`);
    } finally {
      setIsLoadingComparison(false);
    }
  };

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
        </div>
      </nav>

      {/* Map Container - Full Screen with Overlays */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <DynamicPropertyMap
            properties={properties}
            onPropertySelect={handlePropertySelect}
            selectedProperty={selectedProperty}
            compareMode={compareMode}
            selectedForCompare={selectedForCompare}
          />
        </div>

        {/* Search Bar Overlay - Top Center */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
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

          {/* Filter Button */}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "default" : "outline"}
            className={`shadow-lg ${showFilters ? 'bg-primary text-white' : 'bg-white/95 backdrop-blur-sm'}`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </Button>

          {/* Compare Toggle Button */}
          <Button
            onClick={toggleCompareMode}
            variant={compareMode ? "default" : "outline"}
            className={`shadow-lg ${compareMode ? 'bg-primary text-white' : 'bg-white/95 backdrop-blur-sm'}`}
          >
            <GitCompare className="w-4 h-4 mr-2" />
            {compareMode ? 'Comparing' : 'Compare'}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 w-[500px]">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-900">Price Filter</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Max Price:</span>
                  <span className="text-xl font-bold text-primary">
                    ${maxPrice.toLocaleString()}
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    step={10000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((maxPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, #e5e7eb ${((maxPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>${priceRange.min.toLocaleString()}</span>
                  <span>${priceRange.max.toLocaleString()}</span>
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Showing:</span>
                    <span className="font-semibold text-neutral-900">
                      {properties.length} of {allProperties.length} properties
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={() => {
                    setMaxPrice(priceRange.max);
                    setShowFilters(false);
                  }}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Compare Mode Banner */}
        {compareMode && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
              <span className="text-sm font-medium">
                Select 2-3 properties to compare ({selectedForCompare.length}/3 selected)
              </span>
              {selectedForCompare.length >= 2 && (
                <Button
                  onClick={handleCompare}
                  disabled={isLoadingComparison}
                  size="sm"
                  variant="outline"
                  className="bg-white text-blue-600 hover:bg-neutral-100"
                >
                  {isLoadingComparison ? 'Loading...' : 'Compare Now'}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Selected Properties for Comparison */}
        {compareMode && selectedForCompare.length > 0 && (
          <div className="absolute bottom-6 left-6 z-20 flex gap-3">
            {selectedForCompare.map((property) => (
              <div
                key={property.id}
                className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 border-primary w-64"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-neutral-900">
                      ${property.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-600 line-clamp-1">
                      {property.address}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCompare(property.id)}
                    className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  <span>{property.bedrooms} beds</span>
                  <span>•</span>
                  <span>{property.bathrooms} baths</span>
                  <span>•</span>
                  <span>{property.sqft.toLocaleString()} sqft</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Property Card Overlay - Bottom Center (Zillow-style) */}
        <AnimatePresence>
          {selectedProperty && (
            <PropertyCard
              property={selectedProperty}
              onClose={handleCloseCard}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
