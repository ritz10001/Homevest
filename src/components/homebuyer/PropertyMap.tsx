'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
  compareMode?: boolean;
  selectedForCompare?: Property[];
}

// Custom price tag icon
const createPriceIcon = (price: number, isSelected: boolean) => {
  const priceText = `$${(price / 1000).toFixed(0)}k`;
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div class="price-tag ${isSelected ? 'selected' : ''}">
        <span>${priceText}</span>
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 30],
  });
};

function MapUpdater({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || 11);
  }, [center, zoom, map]);
  return null;
}

export function PropertyMap({ properties, onPropertySelect, selectedProperty, compareMode = false, selectedForCompare = [] }: PropertyMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-neutral-100 rounded-2xl flex items-center justify-center">
        <p className="text-neutral-500">Loading map...</p>
      </div>
    );
  }

  // Center on Houston, TX (average of property coordinates)
  const center: [number, number] = selectedProperty
    ? [selectedProperty.lat, selectedProperty.lng]
    : [29.9, -95.18]; // Houston, TX
  
  const zoom = selectedProperty ? 14 : 11; // Zoom in on selected property, otherwise show all Houston
  
  // Check if property is selected for comparison
  const isPropertySelectedForCompare = (propertyId: number) => {
    return selectedForCompare.some(p => p.id === propertyId);
  };

  return (
    <>
      <style jsx global>{`
        .custom-price-marker {
          background: transparent;
          border: none;
        }
        
        .price-tag {
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          padding: 4px 12px;
          font-weight: 600;
          font-size: 13px;
          color: #3b82f6;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          white-space: nowrap;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .price-tag:hover {
          background: #3b82f6;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .price-tag.selected {
          background: #3b82f6;
          color: white;
          border-color: #2563eb;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
          transform: scale(1.15);
        }
        
        .price-tag.compare-selected {
          background: #10b981;
          color: white;
          border-color: #059669;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
          transform: scale(1.15);
        }
        
        .leaflet-container {
          border-radius: 16px;
          z-index: 0;
        }
      `}</style>
      
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '16px' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} zoom={zoom} />
        {properties.map((property) => {
          const isSelected = selectedProperty?.id === property.id;
          const isCompareSelected = isPropertySelectedForCompare(property.id);
          
          return (
            <Marker
              key={property.id}
              position={[property.lat, property.lng]}
              icon={L.divIcon({
                className: 'custom-price-marker',
                html: `
                  <div class="price-tag ${isSelected ? 'selected' : ''} ${isCompareSelected ? 'compare-selected' : ''}">
                    <span>${(property.price / 1000).toFixed(0)}k</span>
                  </div>
                `,
                iconSize: [60, 30],
                iconAnchor: [30, 30],
              })}
              eventHandlers={{
                click: () => onPropertySelect(property),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">${property.price.toLocaleString()}</p>
                  <p className="text-xs text-neutral-600">{property.address}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {property.bedrooms} bed • {property.bathrooms} bath • {property.sqft} sqft
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}
