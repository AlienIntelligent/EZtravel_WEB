import { useMemo } from "react";
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { setHighlightedItemId } from '../../../store/tripSlice';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = {
 width: '100%',
 height: '100%',
 minHeight: '400px',
 borderRadius: '16px'
};

const defaultCenter = {
 lat: 16.047079, // Da Nang as default center
 lng: 108.206230
};

function MapPanel() {
 const dispatch = useAppDispatch();
 const timelineDays = useAppSelector((state) => state.trip.timelineDays);
 const scratchpadPlaces = useAppSelector((state) => state.trip.scratchpadPlaces);
 const placesDictionary = useAppSelector((state) => state.trip.placesDictionary);
 const highlightedItemId = useAppSelector((state) => state.trip.highlightedItemId);

  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "").trim();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || 'DUMMY'
  });

  if (!apiKey) {
    return (
      <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "16px", minHeight: '400px' }}>
        <div className="card-body p-4 bg-light d-flex flex-column align-items-center justify-content-center text-center">
          <p className="text-muted fw-bold mb-1">Bản đồ chưa được cấu hình</p>
          <p className="text-muted small">Vui lòng thêm VITE_GOOGLE_MAPS_API_KEY vào file .env</p>
        </div>
      </div>
    );
  }

 // Extract all places from timeline and scratchpad
 const mapMarkers = useMemo(() => {
 const markers = [];

 // 1. Add Scratchpad Places
 scratchpadPlaces.forEach((tripPlace) => {
 const place = placesDictionary[tripPlace.placeId];
 if (place && place.latitude && place.longitude) {
 markers.push({
 id: tripPlace.id,
 lat: place.latitude,
 lng: place.longitude,
 title: place.name,
 isScratchpad: true
 });
 }
 });

 // 2. Add Timeline Places
 timelineDays.forEach((day) => {
 day.nodes.forEach((node) => {
 if (node.type === 'TIMELINE_ITEM' && 'placeId' in node.item) {
 const place = placesDictionary[node.item.placeId];
 if (place && place.latitude && place.longitude) {
 markers.push({
 id: node.item.id,
 lat: place.latitude,
 lng: place.longitude,
 title: place.name,
 isScratchpad: false
 });
 }
 } else if (node.type === 'LOCATION_CANVAS') {
 const place = placesDictionary[node.anchorPlace.placeId];
 if (place && place.latitude && place.longitude) {
 markers.push({
 id: node.anchorPlace.id,
 lat: place.latitude,
 lng: place.longitude,
 title: place.name,
 isScratchpad: false
 });
 }
 }
 });
 });

 return markers;
 }, [timelineDays, scratchpadPlaces, placesDictionary]);

 // Generate path for the Polyline using timeline items only (in order)
 const timelinePath = useMemo(() => {
 const path = [];
 timelineDays.forEach((day) => {
 day.nodes.forEach((node) => {
 if (node.type === 'TIMELINE_ITEM' && 'placeId' in node.item) {
 const place = placesDictionary[node.item.placeId];
 if (place && place.latitude && place.longitude) {
 path.push({ lat: place.latitude, lng: place.longitude });
 }
 } else if (node.type === 'LOCATION_CANVAS') {
 const place = placesDictionary[node.anchorPlace.placeId];
 if (place && place.latitude && place.longitude) {
 path.push({ lat: place.latitude, lng: place.longitude });
 }
 }
 });
 });
 return path;
 }, [timelineDays, placesDictionary]);

 if (!isLoaded) {
 return (
 <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "16px", minHeight: '400px' }}>
 <div className="card-body p-0 d-flex align-items-center justify-content-center bg-light">
 <p className="text-muted">Loading Google Maps...</p>
 </div>
 </div>);

 }

 return (
 <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "16px", minHeight: '400px', overflow: 'hidden' }}>
 <div className="card-body p-0">
 <GoogleMap
 mapContainerStyle={mapContainerStyle}
 center={mapMarkers.length > 0 ? { lat: mapMarkers[0].lat, lng: mapMarkers[0].lng } : defaultCenter}
 zoom={12}
 options={{
 disableDefaultUI: true,
 zoomControl: true
 }}>
 
 {mapMarkers.map((marker) =>
 <Marker
 key={marker.id}
 position={{ lat: marker.lat, lng: marker.lng }}
 title={marker.title}
 onClick={() => dispatch(setHighlightedItemId(marker.id))}
 icon={
 marker.id === highlightedItemId ?
 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' :
 marker.isScratchpad ?
 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png' :
 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
 } />

 )}

 {timelinePath.length > 1 &&
 <Polyline
 path={timelinePath}
 options={{
 strokeColor: '#ff5a5f',
 strokeOpacity: 0.8,
 strokeWeight: 4,
 geodesic: true
 }} />

 }
 </GoogleMap>
 </div>
 </div>);

}

export default MapPanel;