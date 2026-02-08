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
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 6px 14px;
          font-weight: 600;
          font-size: 14px;
          color: #0f172a;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
          white-space: nowrap;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          backdrop-filter: blur(8px);
        }
        
        .price-tag:hover {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
          border-color: #15803d;
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 8px 20px rgba(22, 163, 74, 0.25), 0 4px 8px rgba(22, 163, 74, 0.15);
        }
        
        .price-tag.selected {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white;
          border-color: #15803d;
          box-shadow: 0 8px 24px rgba(22, 163, 74, 0.35), 0 4px 12px rgba(22, 163, 74, 0.2);
          transform: scale(1.12) translateY(-3px);
        }
        
        .price-tag.compare-selected {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border-color: #2563eb;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35), 0 4px 12px rgba(59, 130, 246, 0.2);
          transform: scale(1.12) translateY(-3px);
        }
        
        .leaflet-container {
          border-radius: 16px;
          z-index: 0;
        }
        
        /* Custom Zoom Controls Styling */
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04) !important;
          border-radius: 12px !important;
          overflow: hidden;
          backdrop-filter: blur(8px);
        }
        
        .leaflet-control-zoom a {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          background: rgba(255, 255, 255, 0.95) !important;
          color: #0f172a !important;
          border: none !important;
          font-size: 20px !important;
          font-weight: 600 !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
          color: white !important;
          transform: scale(1.05);
        }
        
        .leaflet-control-zoom a:first-child {
          border-radius: 12px 12px 0 0 !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        
        .leaflet-control-zoom a:last-child {
          border-radius: 0 0 12px 12px !important;
        }
        
        .leaflet-control-zoom a.leaflet-disabled {
          opacity: 0.4 !important;
          cursor: not-allowed !important;
          background: rgba(255, 255, 255, 0.95) !important;
          color: #94a3b8 !important;
        }
        
        .leaflet-control-zoom a.leaflet-disabled:hover {
          background: rgba(255, 255, 255, 0.95) !important;
          color: #94a3b8 !important;
          transform: none !important;
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
