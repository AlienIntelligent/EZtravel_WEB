import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar, Image as ImageIcon } from "lucide-react";

export default function TripSummaryHeader({ trip }) {
  if (!trip) return null;

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border overflow-hidden shadow-sm animate-fade-in">
      <div className="h-48 w-full relative bg-muted flex items-center justify-center overflow-hidden">
        {trip.thumbnail ? (
          <img src={trip.thumbnail} alt={trip.tenLichTrinh} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6 text-white flex justify-between items-end">
          <div>
            <div className="flex gap-2 mb-2">
              <Badge variant={trip.trangThai === 'DRAFT' ? 'secondary' : 'default'} className="bg-primary/80 backdrop-blur-sm text-white border-none">
                {trip.trangThai}
              </Badge>
              {trip.laCongKhai && (
                <Badge variant="outline" className="text-white border-white/50 backdrop-blur-sm bg-black/20">
                  Public
                </Badge>
              )}
            </div>
            <h2 className="text-3xl font-bold tracking-tight">{trip.tenLichTrinh}</h2>
          </div>
          <div className="hidden sm:block text-right">
            {(trip.ngayBatDau && trip.ngayKetThuc) && (
              <div className="flex items-center gap-1.5 text-sm font-medium bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Calendar className="h-4 w-4" />
                {format(new Date(trip.ngayBatDau), "MMM d")} - {format(new Date(trip.ngayKetThuc), "MMM d, yyyy")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
