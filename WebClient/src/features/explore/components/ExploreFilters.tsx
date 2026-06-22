import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ExploreFiltersProps {
  activeTab: "places" | "services";
  province: string | null;
  serviceCategory: string | null;
  rating: number;
  partnerType: string;
  onProvinceChange: (val: string | null) => void;
  onCategoryChange: (val: string | null) => void;
  onRatingChange: (val: number) => void;
  onPartnerTypeChange: (val: string) => void;
  onReset: () => void;
}

export default function ExploreFilters({
  activeTab,
  province,
  serviceCategory,
  rating,
  partnerType,
  onProvinceChange,
  onCategoryChange,
  onRatingChange,
  onPartnerTypeChange,
  onReset,
}: ExploreFiltersProps) {
  return (
    <div className="space-y-5 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
        <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-slate-100">
          Bộ lọc tìm kiếm
        </h4>
        <Button
          variant="link"
          onClick={onReset}
          className="h-auto p-0 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
        >
          Xóa lọc
        </Button>
      </div>

      {/* Location Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Tỉnh / Thành phố
        </label>
        <Select
          value={province || "ALL"}
          onValueChange={(val) => onProvinceChange(val === "ALL" ? null : val)}
        >
          <SelectTrigger className="w-full text-xs h-9 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="Da Nang">Đà Nẵng</SelectItem>
            <SelectItem value="Hoi An">Hội An</SelectItem>
            <SelectItem value="Hue">Huế</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter (only for services tab) */}
      {activeTab === "services" && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Loại dịch vụ
          </label>
          <Select
            value={serviceCategory || "ALL"}
            onValueChange={(val) => onCategoryChange(val === "ALL" ? null : val)}
          >
            <SelectTrigger className="w-full text-xs h-9 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="ACCOMMODATION">Khách sạn / Chỗ ở</SelectItem>
              <SelectItem value="FOOD">Nhà hàng / Ăn uống</SelectItem>
              <SelectItem value="ACTIVITY">Hoạt động / Vui chơi</SelectItem>
              <SelectItem value="TRANSPORT">Phương tiện di chuyển</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Partner Type Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Cấp đối tác
        </label>
        <Select value={partnerType} onValueChange={onPartnerTypeChange}>
          <SelectTrigger className="w-full text-xs h-9 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="VERIFIED_PARTNER">Đối tác Xác minh</SelectItem>
            <SelectItem value="PREMIUM_PARTNER">Đối tác Premium</SelectItem>
            <SelectItem value="FEATURED">Nổi bật</SelectItem>
            <SelectItem value="TRENDING">Thịnh hành</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Đánh giá tối thiểu
        </label>
        <Select
          value={rating.toString()}
          onValueChange={(val) => onRatingChange(parseFloat(val))}
        >
          <SelectTrigger className="w-full text-xs h-9 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
            <SelectValue placeholder="Bất kỳ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Bất kỳ</SelectItem>
            <SelectItem value="5">5 Sao</SelectItem>
            <SelectItem value="4">4 Sao trở lên</SelectItem>
            <SelectItem value="3">3 Sao trở lên</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
