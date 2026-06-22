import { format } from "date-fns";
import { MapPin, Clock, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function TripTimelineView({ trip }) {
  if (!trip?.days?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-muted/30">
        <MapPin className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No Timeline Created</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          This trip doesn't have an itinerary yet. Once locations are added to days, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pl-4 border-l-2 border-primary/20 ml-4">
      {trip.days.map((day) => (
        <div key={day.maNgay} className="relative">
          {/* Timeline Dot */}
          <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
          
          <div className="mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              Day {day.soThuTu}
              {day.ngay && (
                <span className="text-sm font-normal text-muted-foreground">
                  • {format(new Date(day.ngay), "EEEE, MMM d, yyyy")}
                </span>
              )}
            </h3>
            {day.ghiChu && <p className="text-sm text-muted-foreground mt-1">{day.ghiChu}</p>}
          </div>

          <div className="space-y-3 mt-4">
            {day.items?.length > 0 ? (
              day.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <div className="flex flex-col items-center justify-start text-sm font-medium text-muted-foreground min-w-[80px]">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.startTime}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">{item.tieuDe || item.tenDiaDiem || "Activity"}</h4>
                    {item.tenDiaDiem && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {item.tenDiaDiem}
                      </div>
                    )}
                    {item.ghiChu && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                        <Info className="h-3 w-3" />
                        {item.ghiChu}
                      </div>
                    )}
                  </div>
                  {item.chiPhiDuKien > 0 && (
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {formatCurrency(item.chiPhiDuKien)}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground italic p-4 rounded-lg bg-muted/50 border border-dashed">
                No activities scheduled for this day.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
