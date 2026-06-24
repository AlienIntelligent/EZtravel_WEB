import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Image as ImageIcon } from "lucide-react";

export default function TripDestinations({ trip }) {
 if (!trip?.days) return null;

 // Extract all unique destinations from the timeline
 const destinations = [];
 const seen = new Set();

 trip.days.forEach(day => {
 day.items?.forEach(item => {
 if (item.maDiaDiem && item.tenDiaDiem && !seen.has(item.maDiaDiem)) {
 seen.add(item.maDiaDiem);
 destinations.push({
 id: item.maDiaDiem,
 name: item.tenDiaDiem,
 day: day.soThuTu
 });
 }
 });
 });

 if (destinations.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-muted/30">
 <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
 <h3 className="text-lg font-medium">No Destinations Yet</h3>
 <p className="text-sm text-muted-foreground mt-1 max-w-sm">
 Locations added to the itinerary will automatically appear here.
 </p>
 </div>
 );
 }

 return (
 <div className="space-y-6 animate-fade-in">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {destinations.map((dest, index) => (
 <Card key={`${dest.id}-${index}`} className="overflow-hidden group hover:shadow-md transition-all">
 <div className="aspect-video bg-muted relative flex items-center justify-center overflow-hidden">
 <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
 <div className="text-white">
 <h4 className="font-semibold text-lg">{dest.name}</h4>
 <p className="text-xs opacity-90">First visited on Day {dest.day}</p>
 </div>
 </div>
 </div>
 <CardContent className="p-4 flex items-center justify-between">
 <div className="flex items-center text-sm text-muted-foreground">
 <MapPin className="h-4 w-4 mr-1" />
 Destination {index + 1}
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 </div>
 );
}
