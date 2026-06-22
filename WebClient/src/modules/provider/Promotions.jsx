
import { useGetProfileQuery } from "../../store/apis/authApi";
import { useGetCurrentProviderPackageQuery } from "../../store/apis/providerApi";
import { useGetExploreGridQuery } from "../../store/apis/exploreApi";
import { PartnerBadge } from "@/components/ui/PartnerBadge";

import EmptyState from "../../features/explore/components/EmptyState";
import { Compass, Search, Home, ShieldAlert, Sparkles } from "lucide-react";

export default function ProviderPromotions() {


  // Fetch provider profile, current package, and promoted list
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const { data: currentPackage, isLoading: isPkgLoading } = useGetCurrentProviderPackageQuery();
  const { data: promotedList, isLoading: isPromotedLoading } = useGetExploreGridQuery({});

  const isLoading = isProfileLoading || isPkgLoading || isPromotedLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto py-4">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>);

  }

  // Identify if this provider has an active badge returned by the backend DTO
  const providerId = profile?.maNhaCungCap;
  const promotedItems = Array.isArray(promotedList) ? promotedList : promotedList?.items || promotedList?.data || [];
  const promoInfo = promotedItems.find((p) => p.providerId === providerId);
  const badgeType = promoInfo?.badgeType && promoInfo.badgeType !== "NONE" ? promoInfo.badgeType : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Title */}
      <div>
        <h3 className="text-2xl font-serif font-bold text-slate-950 dark:text-slate-50">
          Trung tâm Quảng bá
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Theo dõi các huy hiệu đối tác chính thức và hiệu suất tiếp cận khách hàng trên ezTravel.
        </p>
      </div>

      {/* 1. Package & Badge status */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Gói dịch vụ đang hoạt động
          </span>
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-1">
            {currentPackage?.tenGoi || "Gói Miễn Phí"}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Phân hạng gói quyết định quyền lợi và điểm xếp hạng hiển thị của bạn.
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5">
          <span className="text-xs font-medium text-slate-400">Huy hiệu đối tác:</span>
          {badgeType ?
          <PartnerBadge type={badgeType} /> :

          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              Không có huy hiệu
            </span>
          }
        </div>
      </div>

      {/* 2. Promotion Benefits Section */}
      {badgeType ? (
      /* Render Promotion Benefits normally if badgeType is active */
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div>
            <h4 className="text-base font-bold text-slate-950 dark:text-slate-50">
              Chi tiết đặc quyền quảng bá hiện tại
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Doanh nghiệp của bạn đang nhận được các đặc quyền tiếp cận sau từ hệ thống:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Visibility */}
            {currentPackage?.uuTienTimKiem &&
          <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 dark:bg-teal-950/10 space-y-2">
                <Search className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Search Visibility
                </h5>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Đẩy cao dịch vụ của bạn khi khách hàng lọc hoặc tìm kiếm các địa điểm liên quan.
                </p>
              </div>
          }

            {/* Homepage Visibility */}
            {currentPackage?.uuTienTrangChu &&
          <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 dark:bg-teal-950/10 space-y-2">
                <Home className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Homepage Visibility
                </h5>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Dịch vụ xuất hiện ngẫu nhiên trong danh sách Đối tác nổi bật tại trang chủ ezTravel.
                </p>
              </div>
          }

            {/* Explore Visibility */}
            {currentPackage && currentPackage.heSoUuTien > 1.0 &&
          <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 dark:bg-teal-950/10 space-y-2">
                <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Explore Visibility
                </h5>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Hệ số thứ hạng hiển thị tại bản đồ và lưới tìm kiếm trang Khám Phá: <span className="font-bold">{currentPackage.heSoUuTien}</span>.
                </p>
              </div>
          }
          </div>
        </div>) : (

      /* If badgeType is unavailable, render promotion information as Coming Soon / Inactive */
      <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-amber-800 dark:text-amber-300">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold block mb-1">Chưa kích hoạt quyền lợi quảng bá</span>
              Doanh nghiệp của bạn chưa được cấp huy hiệu đối tác chính thức từ hệ thống. Các quyền lợi quảng bá chưa sẵn sàng hiển thị. Vui lòng nâng cấp lên gói cước Commercial để nhận quyền lợi hiển thị.
            </div>
          </div>

          <EmptyState
          title="Quyền lợi hiển thị (Sắp ra mắt / Chưa kích hoạt)"
          description="Thông tin hiển thị quảng bá chi tiết sẽ được tự động kích hoạt sau khi hệ thống ghi nhận huy hiệu đối tác của bạn."
          icon={Sparkles} />
        
        </div>)
      }
    </div>);

}
