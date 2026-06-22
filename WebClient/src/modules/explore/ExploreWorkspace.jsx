/* eslint-disable no-unused-vars, react-hooks/set-state-in-effect */
import { useState, useMemo  } from "react";
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
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-950/20">
      {/* Search Header Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-2xl font-serif font-bold text-slate-950 dark:text-slate-50">
              Khám phá Việt Nam
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tìm các địa điểm du lịch lý thú và dịch vụ du lịch tin cậy cho hành trình của bạn.
            </p>
          </div>

          <div className="w-full md:max-w-md">
            <ExploreSearchBar value={keyword} onChange={handleKeywordChange} />
          </div>
        </div>
      </div>

      {/* Tabs & View Controls */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
          {/* Places / Services Tab Switch */}
          <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => dispatch(setActiveTab("places"))}
              className={`px-4 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === "places" ?
              "bg-white dark:bg-slate-900 text-primary shadow-sm" :
              "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"}`
              }>
              
              Địa điểm
            </button>
            <button
              onClick={() => dispatch(setActiveTab("services"))}
              className={`px-4 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              activeTab === "services" ?
              "bg-white dark:bg-slate-900 text-primary shadow-sm" :
              "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"}`
              }>
              
              Dịch vụ
            </button>
          </div>

          {/* View Toggles (Visible on Mobile/Tablet only since Desktop displays split map) */}
          <div className="flex items-center gap-3">
            {/* Mobile Filters Drawer Trigger */}
            <div className="lg:hidden">
              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 h-9 text-xs">
                    <Filter className="w-3.5 h-3.5" /> Lọc
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

            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg lg:hidden">
              <button
                onClick={() => dispatch(setViewMode("grid"))}
                className={`p-1.5 rounded-md cursor-pointer ${
                viewMode === "grid" ?
                "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" :
                "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`
                }
                title="Xem lưới">
                
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => dispatch(setViewMode("map"))}
                className={`p-1.5 rounded-md cursor-pointer ${
                viewMode === "map" ?
                "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" :
                "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`
                }
                title="Xem bản đồ">
                
                <MapIcon className="w-4 h-4" />
              </button>
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

          {/* Center Column: Results Grid */}
          <main
            className={`h-full overflow-y-auto lg:col-span-9 xl:col-span-9 grid grid-cols-1 lg:grid-cols-12 gap-8 ${
            viewMode === "map" ? "hidden lg:grid" : "grid"}`
            }>
            
            <div className={`col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col space-y-6 ${viewMode === "map" ? "lg:col-span-5" : "lg:col-span-12"}`}>
              {/* Results count indicator */}
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Tìm thấy <span className="text-slate-900 dark:text-slate-200 font-bold">{itemsToRender.length}</span> kết quả
              </div>

              {isLoading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) =>
                <div key={i} className="flex flex-col space-y-3 bg-white dark:bg-slate-900 p-4 border rounded-xl shadow-sm">
                      <Skeleton className="h-40 w-full rounded-lg" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                )}
                </div>) :
              itemsToRender.length === 0 ? (
              /* Empty State */
              <EmptyState
                title="Không tìm thấy kết quả"
                description="Hãy thử thay đổi từ khóa hoặc thiết lập lại bộ lọc để tìm kiếm rộng hơn."
                icon={Compass} />) : (


              /* Cards list */
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${viewMode === "map" ? "lg:grid-cols-1 xl:grid-cols-2" : "lg:grid-cols-2 xl:grid-cols-3"}`}>
                  {itemsToRender.map((item) => {
                  const badge = isService(item) ? itemBadgesMap.get(item.providerId) : undefined;
                  return (
                    <ExploreCard
                      key={item.id}
                      item={item}
                      type={activeTab === "places" ? "PLACE" : "SERVICE"}
                      badgeType={badge} />);


                })}
                </div>)
              }

              {/* Pagination controls */}
              {itemsToRender.length > 0 &&
              <div className="pt-4 pb-8">
                  <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => dispatch(setPage(p))} />
                
                </div>
              }
            </div>

            {/* Right Column: Google Maps Panel (Persistent on desktop split-view, toggled on mobile/tablet) */}
            <div
              className={`col-span-12 lg:col-span-6 xl:col-span-7 h-[500px] lg:h-full rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 ${
              viewMode === "map" ? "block lg:block" : "hidden lg:block"}`
              }>
              
              <ExploreMapPanel items={itemsToRender} />
            </div>
          </main>

          {/* Full-width Map View container (Mobile only when Map mode selected) */}
          {viewMode === "map" &&
          <div className="lg:hidden col-span-12 h-[calc(100vh-220px)] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
              <ExploreMapPanel items={itemsToRender} />
            </div>
          }
        </div>
      </div>
    </div>);


  function isService(item) {
    return activeTab === "services";
  }
}
