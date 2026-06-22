import React from "react";
import { Star } from "lucide-react";
import { PartnerBadge } from "@/components/ui/PartnerBadge";

interface FeaturedProviderCardProps {
  provider: {
    providerId: number;
    providerName: string;
    rating: number;
    avatar?: string;
    coverImage?: string;
    badgeType: string;
  };
}

export default function FeaturedProviderCard({ provider }: FeaturedProviderCardProps) {
  const { providerName, rating, avatar, coverImage, badgeType } = provider;

  const defaultCover = "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=600&q=80";
  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80";

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={coverImage || defaultCover}
          alt={providerName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge Overlay */}
        {badgeType && badgeType !== "NONE" && (
          <div className="absolute top-3 right-3 z-10">
            <PartnerBadge type={badgeType} />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="relative flex flex-col p-5 pt-8 flex-1">
        {/* Avatar Overlay */}
        <div className="absolute -top-6 left-5 w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-900 shadow-sm bg-white dark:bg-slate-800">
          <img
            src={avatar || defaultAvatar}
            alt={providerName}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-md font-serif font-semibold text-slate-950 dark:text-slate-50 mb-1 line-clamp-1">
          {providerName}
        </h3>

        {/* Rating Row */}
        <div className="flex items-center gap-1 mt-auto">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {rating > 0 ? rating.toFixed(1) : "0.0"}
          </span>
        </div>
      </div>
    </div>
  );
}
