'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/homebuyer/PropertyCard';
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
  zpid?: string;
  imgSrc?: string;
  carouselPhotos?: Array<{ url: string }>;
}

export default function HomebuyerMapDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
