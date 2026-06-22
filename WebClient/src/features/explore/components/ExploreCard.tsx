import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
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
    <div className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <Link to={detailsPath} className="relative block h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
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
          <div className="absolute right-3 top-3 z-10">
            <PartnerBadge type={badgeType} />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <Link
            to={detailsPath}
            className="line-clamp-1 text-base font-bold text-slate-950 hover:text-primary dark:text-slate-50"
          >
            {item.name}
          </Link>
          {isService && "type" in item && (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {(item as Service).type}
            </span>
          )}
        </div>

        <div className="mb-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {item.averageRating?.toFixed(1) || "0.0"}
            </span>
            <span>({item.totalReviews || 0})</span>
          </div>
          <div className="flex items-center gap-0.5">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="line-clamp-1">{displayAddress}</span>
          </div>
        </div>

        <p className="mb-4 line-clamp-3 flex-1 text-xs text-slate-500 dark:text-slate-400">
          {item.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-2 dark:border-slate-800">
          <div>
            {price !== null && (
              <>
                <span className="block text-[10px] font-medium uppercase text-slate-400">Giá từ</span>
                <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  {price.toLocaleString("vi-VN")} đ
                </span>
              </>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to={detailsPath}>Xem chi tiết</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
