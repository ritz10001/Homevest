// components/animated-map-background.tsx
"use client";

interface AnimatedMapBackgroundProps {
  location?: string; // e.g., "Boston, MA" or "Houston, TX"
  coordinates?: {
    lat: number;
    lng: number;
    zoom?: number;
  };
  grayscale?: boolean;
  brightness?: number; // 0-1, default 0.4
  className?: string;
}

export function AnimatedMapBackground({
  location = "Boston, MA",
  coordinates,
  grayscale = true,
  brightness = 0.4,
  className = "",
}: AnimatedMapBackgroundProps) {
  // Generate Google Maps embed URL using the exact pb format
  const getMapUrl = () => {
    if (coordinates) {
      const { lat, lng, zoom = 13 } = coordinates;
      
      // For Boston
      if (lat === 42.3601 && lng === -71.0589) {
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.3563224020837!2d-71.05773268455701!3d42.36008797918487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370a5cb30cc5f%3A0xc53a8e6489686c87!2sBoston%2C%20MA!5e0!3m2!1sen!2sus!4v1234567890";
      }
      
      // For Houston
      if (lat === 29.7604 && lng === -95.3698) {
        return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221841.45324024116!2d-95.55971639453125!3d29.817178799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX!5e0!3m2!1sen!2sus!4v1234567890";
      }
    }
    
    // Default to Boston
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.3563224020837!2d-71.05773268455701!3d42.36008797918487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370a5cb30cc5f%3A0xc53a8e6489686c87!2sBoston%2C%20MA!5e0!3m2!1sen!2sus!4v1234567890";
  };

  const filterStyle = `${grayscale ? "grayscale(100%)" : ""} brightness(${brightness})`.trim();

  return (
    <>
      {/* Map Background Layer */}
      <div className="absolute inset-0 -z-20">
        <iframe
          src={getMapUrl()}
          width="100%"
          height="100%"
          style={{ border: 0, filter: filterStyle }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/90 via-background/55 to-background/90" />
    </>
  );
}
