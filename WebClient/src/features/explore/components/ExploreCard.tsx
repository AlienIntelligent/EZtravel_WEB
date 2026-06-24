import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Heart } from "lucide-react";
import { Place, Service } from "../../../shared/types";
import { PartnerBadge } from "@/components/ui/PartnerBadge";
import { Button } from "@/components/ui/button";

interface ExploreCardProps {
 item: Place | Service;
 type: "PLACE" | "SERVICE";
 badgeType?: string;
}

export default function ExploreCard({ item, type, badgeType }: ExploreCardProps) {
 const isService = type === "SERVICE";
 const price = isService && "price" in item ? (item as Service).price : null;
 const address = "address" in item ? item.address : "Vietnam";
 const displayAddress = address.split(",").pop()?.trim() || address;
 const detailsPath = isService
 ? `/explore/services/${item.id}`
 : `/explore/destinations/${item.id}`;
 const fallbackImage = `/images/${
 isService ? "hotel" : "destination"
 }-${((Number(item.id) || 1) - 1) % 6 + 1}.jpg`;

 return (
 <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ">
 <Link to={detailsPath} className="relative block aspect-[4/3] w-full overflow-hidden bg-muted ">
 <img
 src={item.images?.[0] || fallbackImage}
 alt={item.name}
 className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
 loading="lazy"
 onError={(event) => {
 if (event.currentTarget.src.endsWith(fallbackImage)) return;
 event.currentTarget.src = fallbackImage;
 }}
 />
 {badgeType && badgeType !== "NONE" && (
 <div className="absolute left-3 top-3 z-10">
 <PartnerBadge type={badgeType} />
 </div>
 )}
 <button className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm transition-colors hover:bg-background hover:text-cta /90 dark:hover:bg-slate-900">
 <Heart className="h-4 w-4" />
 </button>
 </Link>

 <div className="flex flex-1 flex-col p-4">
 <div className="mb-1 flex items-start justify-between gap-2">
 <Link
 to={detailsPath}
 className="line-clamp-1 font-sans text-lg font-bold text-foreground hover:text-primary "
 >
 {item.name}
 </Link>
 <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-muted-foreground ">
 {item.averageRating?.toFixed(1) || "0.0"}
 <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
 </div>
 </div>

 <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground ">
 <div className="flex items-center gap-1">
 <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
 <span className="line-clamp-1">{displayAddress}</span>
 </div>
 {isService && "type" in item && (
 <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
 {(item as Service).type}
 </span>
 )}
 </div>

 <p className="mb-4 line-clamp-2 flex-1 text-xs text-muted-foreground ">
 {item.description}
 </p>

 {price !== null && (
 <div className="mb-3 flex items-baseline gap-1">
 <span className="text-[10px] font-medium uppercase text-muted-foreground">Giá từ</span>
 <span className="text-sm font-semibold text-primary">
 {price.toLocaleString("vi-VN")} đ
 </span>
 </div>
 )}

 <div className="mt-auto flex flex-col gap-2 pt-3 border-t border-border ">
 <Button size="sm" className="w-full bg-cta text-cta-foreground hover:bg-cta/90 border-0 font-medium">
 + Thêm vào lịch trình
 </Button>
 <Button variant="outline" size="sm" className="w-full border-secondary text-secondary hover:bg-secondary/5 hover:text-secondary font-medium" asChild>
 <Link to={detailsPath}>Xem chi tiết</Link>
 </Button>
 </div>
 </div>
 </div>
 );
}
