import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

/**
 * A mock Google Map View component using iframe for display purposes.
 * It simulates a map centered on a specific location.
 */
export function GoogleMapView({ title = "Địa điểm", address = "Hanoi, Vietnam", className = "w-full h-[400px]" }) {
  const [isLoading, setIsLoading] = useState(true);

  // Encode the address for the map query
  const query = encodeURIComponent(address);
  const mapSrc = `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`relative rounded-xl overflow-hidden border border-border shadow-sm bg-muted ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 backdrop-blur-sm z-10 animate-pulse">
          <MapPin className="h-8 w-8 text-primary mb-2 animate-bounce" />
          <span className="text-sm font-medium text-muted-foreground">Đang tải bản đồ...</span>
        </div>
      )}
      
      <iframe
        src={mapSrc}
        title={title}
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen=""
        aria-hidden="false"
        tabIndex="0"
        onLoad={() => setIsLoading(false)}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Optional overlay text if needed */}
      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-border text-xs font-semibold z-20 flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        {address}
      </div>
    </div>
  );
}
