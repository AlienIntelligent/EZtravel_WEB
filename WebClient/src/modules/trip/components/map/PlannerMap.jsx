import { useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, MapPinned } from "lucide-react";
import { useAppSelector } from "../../../../store/hooks";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 16.0544,
  lng: 108.2022,
};

export default function PlannerMap() {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "").trim();
  const timelineDays = useAppSelector((state) => state.trip.timelineDays);
  const placesDict = useAppSelector((state) => state.trip.placesDictionary);
  const servicesDict = useAppSelector((state) => state.trip.servicesDictionary);

  const markers = useMemo(() => {
    const result = [];
    timelineDays.forEach((day) => {
      (day.nodes || []).forEach((node) => {
        const placeId =
          node.type === "LOCATION_CANVAS"
            ? node.anchorPlace?.placeId
            : node.type === "TIMELINE_ITEM" && "placeId" in node.item
              ? node.item.placeId
              : node.type === "TIMELINE_ITEM" && "serviceId" in node.item
                ? servicesDict[node.item.serviceId]?.placeId
                : null;
        const place = placeId ? placesDict[placeId] : null;
        if (!place) return;

        const position = result.length;
        result.push({
          id: node.id,
          lat: Number(place.latitude) || defaultCenter.lat + ((position % 3) - 1) * 0.025,
          lng: Number(place.longitude) || defaultCenter.lng + ((position % 4) - 1.5) * 0.025,
          name: place.name,
        });
      });
    });
    return result;
  }, [placesDict, servicesDict, timelineDays]);

  return apiKey ? (
    <PlannerMapGoogle apiKey={apiKey} markers={markers} />
  ) : (
    <PlannerMapFallback markers={markers} />
  );
}

function PlannerMapFallback({ markers }) {
  return (
    <section className="h-full min-h-[360px] overflow-y-auto bg-white">
      <header className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <MapPinned className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 className="text-sm font-bold text-slate-900">Điểm đến trong lịch trình</h2>
      </header>
      {markers.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <MapPin className="h-8 w-8 text-slate-300" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-500">Chưa có địa điểm trên bản đồ.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {markers.map((marker, index) => (
            <div key={marker.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="min-w-0 truncate text-sm font-semibold text-slate-800">{marker.name}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function PlannerMapGoogle({ apiKey, markers }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  if (loadError) return <PlannerMapFallback markers={markers} />;
  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-72 items-center justify-center" role="status">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-b-primary" />
        <span className="sr-only">Đang tải bản đồ</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
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
          title={marker.name}
        />
      ))}
    </GoogleMap>
  );
}
