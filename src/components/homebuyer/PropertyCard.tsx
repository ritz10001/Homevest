'use client';

import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

interface PropertyCardProps {
  property: Property;
  onClose: () => void;
}

export function PropertyCard({ property, onClose }: PropertyCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const photos = property.carouselPhotos || [];
  const hasPhotos = photos.length > 0;

  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [property.id]);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleDoubleClick = () => {
    router.push(`/homebuyer/property/${property.id}`);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden z-40"
      onDoubleClick={handleDoubleClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-20 w-9 h-9 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-neutral-700" />
      </button>

      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 left-3 z-20 w-9 h-9 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        aria-label="Add to favorites"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-700'
          }`}
        />
      </button>

      {/* Image Carousel */}
      <div className="relative h-72 bg-neutral-200 overflow-hidden">
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

            {/* Navigation Buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5 text-neutral-900" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5 text-neutral-900" />
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.slice(0, 8).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPhotoIndex(index);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentPhotoIndex
                        ? 'bg-white w-6'
                        : 'bg-white/60 hover:bg-white/80 w-1.5'
                    }`}
                    aria-label={`Go to photo ${index + 1}`}
                  />
                ))}
                {photos.length > 8 && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                )}
              </div>
            )}

            {/* Photo Counter */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300">
            <span className="text-neutral-400 text-sm">No photos available</span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-5">
        <div className="flex items-baseline gap-2 mb-2">
          <h3 className="text-3xl font-bold text-neutral-900">
            ${property.price.toLocaleString()}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
          <span className="font-semibold">{property.bedrooms} bds</span>
          <span>•</span>
          <span className="font-semibold">{property.bathrooms} ba</span>
          <span>•</span>
          <span className="font-semibold">{property.sqft.toLocaleString()} sqft</span>
        </div>

        <p className="text-neutral-700 text-sm mb-4">{property.address}</p>

        <div className="text-xs text-neutral-500 text-center pt-3 border-t border-neutral-200">
          Double-click to view full details and analysis
        </div>
      </div>
    </motion.div>
  );
}
