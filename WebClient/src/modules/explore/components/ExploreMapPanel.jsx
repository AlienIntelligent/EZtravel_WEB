import { useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, MapPinned } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 16.047079,
  lng: 108.20623,
};

function ExploreMapPanel({ items }) {
  const markers = useMemo(
    () =>
      items
        .filter((item) => "latitude" in item && item.latitude && item.longitude)
        .map((item) => ({
          id: item.id,
          lat: Number(item.latitude),
          lng: Number(item.longitude),
          title: item.name,
        })),
    [items],
  );

  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "").trim();
  return apiKey ? (
    <ExploreGoogleMap apiKey={apiKey} markers={markers} />
  ) : (
    <ExploreMapFallback markers={markers} />
  );
}

function ExploreMapFallback({ markers }) {
  return (
    <section className="min-h-[420px] overflow-hidden rounded-md border border-slate-200 bg-white lg:min-h-[600px]">
      <header className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <MapPinned className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 className="text-sm font-bold text-slate-900">Vị trí đang hiển thị</h2>
      </header>
      {markers.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
          <MapPin className="h-8 w-8 text-slate-300" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-500">Chưa có tọa độ cho kết quả hiện tại.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {markers.map((marker, index) => (
            <div key={marker.id} className="flex items-start gap-3 px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-800">{marker.title}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {marker.lat.toFixed(5)}, {marker.lng.toFixed(5)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ExploreGoogleMap({ apiKey, markers }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  if (loadError) return <ExploreMapFallback markers={markers} />;

  if (!isLoaded) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-md border border-slate-200 bg-slate-50 lg:min-h-[600px]" role="status">
        <p className="text-sm text-slate-500">Đang tải bản đồ...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[420px] overflow-hidden rounded-md border border-slate-200 bg-white lg:min-h-[600px]">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={
          markers.length > 0
            ? { lat: markers[0].lat, lng: markers[0].lng }
            : defaultCenter
        }
        zoom={12}
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

export default ExploreMapPanel;
