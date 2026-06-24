/* eslint-disable no-unused-vars, react-hooks/set-state-in-effect */
import { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveTab, setViewMode, setPage, setFilters, resetFilters } from "@/store/exploreSlice";
import { useGetExploreGridQuery } from "@/store/apis/exploreApi";

import { Filter, Map as MapIcon, Grid, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ExploreSearchBar, ExploreFilters, ExploreCard, EmptyState } from "@/features/explore";
import ExploreMapPanel from "./components/ExploreMapPanel";
import Pagination from "@/shared/components/Pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ExploreWorkspace() {
 const dispatch = useAppDispatch();
 const exploreState = useAppSelector((state) => state.explore);
 const { activeTab, viewMode, keyword, province, serviceCategory, rating, page } = exploreState;

 // Local state for partner type client-side filtering
 const [partnerType, setPartnerType] = useState("ALL");
 const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

 // Fetch current explore data from the backend. Legacy /places/* APIs are no longer active.
 const {
 data: exploreData,
 isLoading: isLoadingExplore,
 isFetching: isFetchingExplore
 } = useGetExploreGridQuery({ ...exploreState, type: activeTab });

 // Fetch promoted providers from backend monetization endpoint
 const { data: promotedProviders } = useGetExploreGridQuery({});

 const isLoading = isLoadingExplore || isFetchingExplore;

 const rawItems = Array.isArray(exploreData) ? exploreData : exploreData?.items || exploreData?.data || [];
 const totalItems = Array.isArray(exploreData) ? rawItems.length : exploreData?.total || rawItems.length;
 const totalPages = exploreData?.totalPages || Math.max(1, Math.ceil(totalItems / 12));

 // Match providerIds with promoted providers list to extract backend-supplied badges
 const itemBadgesMap = useMemo(() => {
 const map = new Map();
 const providers = Array.isArray(promotedProviders) ? promotedProviders : promotedProviders?.items || promotedProviders?.data || [];
 providers.forEach((prov) => {
 if (prov?.providerId !== undefined && prov?.providerId !== null) {
 map.set(prov.providerId.toString(), prov.badgeType);
 }
 });
 return map;
 }, [promotedProviders]);

 // Client-side filtering only for partner type metadata (no sorting/boosting)
 const filteredItems = useMemo(() => {
 return rawItems.filter((item) => {
 if (partnerType === "ALL") return true;
 if (activeTab === "places") return false; // Places do not have providers
 const service = item;
 const badge = itemBadgesMap.get(service.providerId);
 return badge === partnerType;
 });
 }, [rawItems, partnerType, activeTab, itemBadgesMap]);

 // Pagination bounds for filtered list if client-side filter active
 const itemsToRender = filteredItems;

 const handleKeywordChange = (val) => {
 dispatch(setFilters({ keyword: val }));
 };

 const handleProvinceChange = (val) => {
 dispatch(setFilters({ province: val }));
 };

 const handleCategoryChange = (val) => {
 dispatch(setFilters({ serviceCategory: val }));
 };

 const handleRatingChange = (val) => {
 dispatch(setFilters({ rating: val }));
 };

 const handleResetFilters = () => {
 dispatch(resetFilters());
 setPartnerType("ALL");
 };

 return (
 <div className="flex-1 flex flex-col min-h-0 bg-background ">
 {/* Search Header Banner with Background Image */}
 <div className="relative bg-slate-900 pt-16 pb-16 px-4 md:px-8 overflow-hidden">
 {/* Background Image Setup */}
 <div className="absolute inset-0 z-0">
 <img src="https://images.unsplash.com/photo-1528127269322-539811f90982?q=80&w=2070&auto=format&fit=crop" 
 alt="Vietnam landscape" 
 className="w-full h-full object-cover opacity-40" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
 </div>
 
 <div className="relative z-10 container mx-auto max-w-7xl flex flex-col items-center justify-center text-center gap-4">
 <div className="space-y-3">
 <h1 className="text-4xl md:text-5xl font-sans font-bold text-white drop-shadow-md">
 Khám phá Việt Nam
 </h1>
 <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto drop-shadow-sm">
 Tìm địa điểm, dịch vụ và cảm hứng cho hành trình của bạn
 </p>
 </div>
 </div>
 </div>

 {/* Tabs & View Controls */}
 <div className="bg-background border-b border-border py-3 px-4 md:px-8 sticky top-[64px] z-40 shadow-sm">
 <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
 
 {/* Left: Places / Services Tab Switch */}
 <div className="flex items-center gap-4 w-full sm:w-auto">
 <div className="flex gap-1.5 p-1 bg-muted rounded-lg text-sm w-full sm:w-auto">
 <button
 onClick={() => dispatch(setActiveTab("places"))}
 className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-semibold transition-colors cursor-pointer ${
 activeTab === "places" ?
 "bg-background text-primary shadow-sm" :
 "text-muted-foreground hover:text-foreground"}`
 }>
 Địa điểm
 </button>
 <button
 onClick={() => dispatch(setActiveTab("services"))}
 className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-semibold transition-colors cursor-pointer ${
 activeTab === "services" ?
 "bg-background text-primary shadow-sm" :
 "text-muted-foreground hover:text-foreground"}`
 }>
 Dịch vụ
 </button>
 </div>
 </div>

 {/* Right: Results count, Sort, Filters & View Toggles */}
 <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
 {/* Desktop Only: Results & Sort */}
 <div className="hidden lg:flex items-center gap-3">
 <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">{totalItems} kết quả</span>
 <Select defaultValue="newest">
 <SelectTrigger className="h-9 w-[140px] text-sm bg-background border-border">
 <SelectValue placeholder="Sắp xếp" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="newest">Mới nhất</SelectItem>
 <SelectItem value="popular">Phổ biến</SelectItem>
 <SelectItem value="rating">Đánh giá cao</SelectItem>
 </SelectContent>
 </Select>
 </div>

 <div className="h-6 w-px bg-border hidden lg:block mx-1"></div>

 {/* Actions: Mobile Filters Drawer Trigger & Layout Toggle */}
 <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
 <div className="lg:hidden">
 <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
 <SheetTrigger asChild>
 <Button variant="outline" size="sm" className="flex items-center gap-1.5 h-10 text-sm w-full sm:w-auto">
 <Filter className="w-4 h-4" /> Lọc
 </Button>
 </SheetTrigger>
 <SheetContent side="left" className="w-[300px] p-6 overflow-y-auto">
 <SheetHeader className="mb-4">
 <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
 </SheetHeader>
 <ExploreFilters
 activeTab={activeTab}
 province={province}
 serviceCategory={serviceCategory}
 rating={rating}
 partnerType={partnerType}
 onProvinceChange={handleProvinceChange}
 onCategoryChange={handleCategoryChange}
 onRatingChange={handleRatingChange}
 onPartnerTypeChange={setPartnerType}
 onReset={handleResetFilters} />
 </SheetContent>
 </Sheet>
 </div>

 {/* View Toggle */}
 <div className="flex gap-1 bg-muted p-1 rounded-lg">
 <button
 onClick={() => dispatch(setViewMode("grid"))}
 className={`p-2 rounded-md cursor-pointer transition-colors ${
 viewMode === "grid" ?
 "bg-background text-foreground shadow-sm" :
 "text-muted-foreground hover:text-foreground"}`
 }
 title="Xem lưới">
 <Grid className="w-4 h-4" />
 </button>
 <button
 onClick={() => dispatch(setViewMode("map"))}
 className={`p-2 rounded-md cursor-pointer transition-colors ${
 viewMode === "map" ?
 "bg-background text-foreground shadow-sm" :
 "text-muted-foreground hover:text-foreground"}`
 }
 title="Xem bản đồ">
 <MapIcon className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Main Workspace Layout Grid */}
 <div className="flex-1 overflow-hidden">
 <div className="h-full container mx-auto max-w-7xl px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
 
 {/* Left Column: Persistent Filters (Desktop Only) */}
 <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 overflow-y-auto pr-2">
 <ExploreFilters
 activeTab={activeTab}
 province={province}
 serviceCategory={serviceCategory}
 rating={rating}
 partnerType={partnerType}
 onProvinceChange={handleProvinceChange}
 onCategoryChange={handleCategoryChange}
 onRatingChange={handleRatingChange}
 onPartnerTypeChange={setPartnerType}
 onReset={handleResetFilters} />
 
 </aside>

 {/* Center Column: Results Grid or Map */}
 <main className="h-full overflow-y-auto lg:col-span-9 xl:col-span-9 w-full">
 
 {viewMode === "grid" && (
 <div className="flex flex-col space-y-6 w-full">
 {/* Results count indicator */}
 <div className="text-xs text-muted-foreground font-medium">
 Tìm thấy <span className="text-foreground font-bold">{itemsToRender.length}</span> kết quả
 </div>

 {isLoading ? (
 /* Loading Skeletons */
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {[...Array(6)].map((_, i) => (
 <div key={i} className="flex flex-col space-y-3 bg-background p-4 border rounded-xl shadow-sm">
 <Skeleton className="h-40 w-full rounded-lg" />
 <Skeleton className="h-6 w-3/4" />
 <Skeleton className="h-4 w-1/4" />
 </div>
 ))}
 </div>
 ) : itemsToRender.length === 0 ? (
 /* Empty State */
 <EmptyState
 title="Không tìm thấy kết quả"
 description="Hãy thử thay đổi từ khóa hoặc thiết lập lại bộ lọc để tìm kiếm rộng hơn."
 icon={Compass} />
 ) : (
 /* Cards list */
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
 {itemsToRender.map((item) => {
 const badge = isService(item) ? itemBadgesMap.get(item.providerId) : undefined;
 return (
 <ExploreCard
 key={item.id}
 item={item}
 type={activeTab === "places" ? "PLACE" : "SERVICE"}
 badgeType={badge} />
 );
 })}
 </div>
 )}

 {/* Pagination controls */}
 {itemsToRender.length > 0 && (
 <div className="pt-4 pb-8">
 <Pagination
 currentPage={page}
 totalPages={totalPages}
 onPageChange={(p) => dispatch(setPage(p))} />
 </div>
 )}
 </div>
 )}

 {viewMode === "map" && (
 <div className="w-full h-[calc(100vh-220px)] rounded-xl overflow-hidden shadow-sm border border-border">
 <ExploreMapPanel items={itemsToRender} />
 </div>
 )}
 </main>
 </div>
 </div>
 </div>);


 function isService(item) {
 return activeTab === "services";
 }
}
