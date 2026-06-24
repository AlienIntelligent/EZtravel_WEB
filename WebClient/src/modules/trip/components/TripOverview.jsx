import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, DollarSign, ListTodo } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function TripOverview({ trip }) {
 if (!trip) return null;

 return (
 <div className="space-y-6 animate-fade-in">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 <Card className="hover:shadow-md transition-shadow">
 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
 <CardTitle className="text-sm font-medium">Destinations</CardTitle>
 <MapPin className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">{trip.soLuongDiaDiem || trip.days?.reduce((acc, day) => acc + day.items?.filter(i => i.maDiaDiem).length, 0) || 0}</div>
 <p className="text-xs text-muted-foreground mt-1">Planned locations</p>
 </CardContent>
 </Card>

 <Card className="hover:shadow-md transition-shadow">
 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
 <CardTitle className="text-sm font-medium">Duration</CardTitle>
 <Calendar className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">{trip.days?.length || 0} Days</div>
 <p className="text-xs text-muted-foreground mt-1">Total itinerary</p>
 </CardContent>
 </Card>

 <Card className="hover:shadow-md transition-shadow">
 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
 <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
 <DollarSign className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold text-green-600">{formatCurrency(trip.tongChiPhi || 0)}</div>
 <p className="text-xs text-muted-foreground mt-1">Total budget</p>
 </CardContent>
 </Card>

 <Card className="hover:shadow-md transition-shadow">
 <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
 <CardTitle className="text-sm font-medium">Activities</CardTitle>
 <ListTodo className="h-4 w-4 text-muted-foreground" />
 </CardHeader>
 <CardContent>
 <div className="text-2xl font-bold">
 {trip.days?.reduce((acc, day) => acc + (day.items?.length || 0), 0) || 0}
 </div>
 <p className="text-xs text-muted-foreground mt-1">Scheduled items</p>
 </CardContent>
 </Card>
 </div>

 <Card className="overflow-hidden">
 <CardHeader>
 <CardTitle>Trip Description</CardTitle>
 </CardHeader>
 <CardContent>
 <p className="text-muted-foreground leading-relaxed">
 {trip.moTa || "No description provided for this trip."}
 </p>
 </CardContent>
 </Card>
 </div>
 );
}
