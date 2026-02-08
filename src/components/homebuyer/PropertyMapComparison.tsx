'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
}

interface PropertyMapProps {
  properties: Property[];
  onPropertySelect: (property: Property) => void;
  selectedProperty: Property | null;
  center?: { lat: number; lng: number };
  comparisonMode?: boolean;
  selectedForComparison?: string[];
}

// Custom price tag icon with comparison support
const createPriceIcon = (price: number, isSelected: boolean, isSelectedForComparison: boolean) => {
  const priceText = `$${(price / 1000).toFixed(0)}k`;
  const checkmark = isSelectedForComparison ? '<span class="checkmark">✓</span>' : '';
  
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div class="price-tag ${isSelected ? 'selected' : ''} ${isSelectedForComparison ? 'comparison-selected' : ''}">
        <span>${priceText}</span>
        ${checkmark}
      </div>
    `,
    iconSize: [70, 35],
    iconAnchor: [35, 35],
  });
};

function MapUpdater({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || 11);
  }, [center, zoom, map]);
  return null;
}

export function PropertyMap({ 
  properties, 
  onPropertySelect, 
  selectedProperty,
  center,
  comparisonMode = false,
  selectedForComparison = []
}: PropertyMapProps) {
  const defaultCenter: [number, number] = [29.7604, -95.3698]; // Houston
  const mapCenter: [number, number] = center ? [center.lat, center.lng] : defaultCenter;

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={mapCenter}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={mapCenter} />

        {properties.map((property) => {
          const isSelected = selectedProperty?.id === property.id;
          const isSelectedForComparison = selectedForComparison.includes(property.zpid || '');
          
          return (
            <Marker
              key={property.id}
              position={[property.lat, property.lng]}
              icon={createPriceIcon(property.price, isSelected, isSelectedForComparison)}
              eventHandlers={{
                click: () => onPropertySelect(property),
              }}
            />
          );
        })}
      </MapContainer>

      <style jsx global>{`
        .price-tag {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          padding: 4px 12px;
          font-weight: 600;
          font-size: 13px;
          color: #1f2937;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .price-tag:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          z-index: 1000;
        }

        .price-tag.selected {
          background: #3b82f6;
          color: white;
          border-color: #2563eb;
          transform: scale(1.15);
        }

        .price-tag.comparison-selected {
          background: #10b981;
          color: white;
          border-color: #059669;
          transform: scale(1.15);
        }

        .price-tag .checkmark {
          font-size: 14px;
          font-weight: bold;
        }

        .custom-price-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}
