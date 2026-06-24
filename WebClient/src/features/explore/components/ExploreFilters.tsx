import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, TreePine, Landmark, Shell, Building2, MoreHorizontal, RotateCcw, Filter } from "lucide-react";

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
 <div className="space-y-6 p-5 bg-background border border-border rounded-xl shadow-sm">
 {/* Location Filter */}
 <div className="space-y-2">
 <label className="text-sm font-semibold text-foreground ">
 Tỉnh / thành phố
 </label>
 <Select
 value={province || "ALL"}
 onValueChange={(val) => onProvinceChange(val === "ALL" ? null : val)}
 >
 <SelectTrigger className="w-full text-sm h-10 bg-background border-border ">
 <SelectValue placeholder="Tất cả tỉnh thành" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="ALL">Tất cả tỉnh thành</SelectItem>
 <SelectItem value="Da Nang">Đà Nẵng</SelectItem>
 <SelectItem value="Hoi An">Hội An</SelectItem>
 <SelectItem value="Hue">Huế</SelectItem>
 <SelectItem value="Quang Ninh">Quảng Ninh</SelectItem>
 <SelectItem value="Khanh Hoa">Khánh Hòa</SelectItem>
 </SelectContent>
 </Select>
 </div>

 <hr className="border-border " />

 {/* Rating Filter (Đánh giá tối thiểu) */}
 <div className="space-y-3">
 <label className="text-sm font-semibold text-foreground ">
 Đánh giá tối thiểu
 </label>
 <div className="grid grid-cols-2 gap-2">
 <button
 onClick={() => onRatingChange(0)}
 className={`flex items-center justify-center gap-1 rounded-md border py-2 text-sm font-medium transition-colors ${
 rating === 0
 ? "border-cta text-cta bg-cta/5"
 : "border-border text-muted-foreground hover:border-input "
 }`}
 >
 Tất cả
 </button>
 <button
 onClick={() => onRatingChange(4)}
 className={`flex items-center justify-center gap-1 rounded-md border py-2 text-sm font-medium transition-colors ${
 rating === 4
 ? "border-cta text-cta bg-cta/5"
 : "border-border text-muted-foreground hover:border-input "
 }`}
 >
 4 <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> trở lên
 </button>
 <button
 onClick={() => onRatingChange(3)}
 className={`flex items-center justify-center gap-1 rounded-md border py-2 text-sm font-medium transition-colors ${
 rating === 3
 ? "border-cta text-cta bg-cta/5"
 : "border-border text-muted-foreground hover:border-input "
 }`}
 >
 3 <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> trở lên
 </button>
 <button
 onClick={() => onRatingChange(2)}
 className={`flex items-center justify-center gap-1 rounded-md border py-2 text-sm font-medium transition-colors ${
 rating === 2
 ? "border-cta text-cta bg-cta/5"
 : "border-border text-muted-foreground hover:border-input "
 }`}
 >
 2 <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> trở lên
 </button>
 </div>
 </div>

 <hr className="border-border " />

 {/* Place Type Checkboxes (Loại địa điểm) */}
 <div className="space-y-3">
 <label className="text-sm font-semibold text-foreground ">
 Loại địa điểm
 </label>
 <div className="flex flex-col gap-3">
 <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
 <Checkbox />
 <TreePine className="h-4 w-4 text-muted-foreground" /> Thiên nhiên
 </label>
 <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
 <Checkbox />
 <Landmark className="h-4 w-4 text-muted-foreground" /> Di sản & Văn hóa
 </label>
 <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
 <Checkbox />
 <Shell className="h-4 w-4 text-muted-foreground" /> Biển đảo
 </label>
 <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
 <Checkbox />
 <Building2 className="h-4 w-4 text-muted-foreground" /> Thành phố
 </label>
 <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
 <Checkbox />
 <MoreHorizontal className="h-4 w-4 text-muted-foreground" /> Khác
 </label>
 </div>
 </div>

 <hr className="border-border " />

 {/* Distance Slider (Khoảng cách) */}
 <div className="space-y-3">
 <label className="text-sm font-semibold text-foreground ">
 Khoảng cách
 </label>
 <div className="pt-2 pb-1">
 <input 
 type="range" 
 min="0" 
 max="500" 
 className="w-full accent-cta h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
 defaultValue="500"
 />
 </div>
 <div className="flex items-center justify-between text-xs text-muted-foreground">
 <span>0 km</span>
 <span>500+ km</span>
 </div>
 </div>

 <hr className="border-border " />

 {/* Amenities (Tiện ích) */}
 <div className="space-y-3">
 <label className="text-sm font-semibold text-foreground ">
 Tiện ích
 </label>
 <div className="flex flex-col gap-3">
 <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
 <Checkbox /> Có thể đặt dịch vụ
 </label>
 <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
 <Checkbox /> Phù hợp gia đình
 </label>
 <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
 <Checkbox /> Thân thiện với thú cưng
 </label>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="pt-2 flex gap-3">
 <Button 
 variant="outline" 
 className="flex-1 border-border text-muted-foreground hover:bg-background"
 onClick={onReset}
 >
 <RotateCcw className="mr-2 h-4 w-4" /> Đặt lại
 </Button>
 <Button className="flex-1 bg-cta hover:bg-cta/90 text-cta-foreground border-0">
 <Filter className="mr-2 h-4 w-4" /> Áp dụng
 </Button>
 </div>
 </div>
 );
}
