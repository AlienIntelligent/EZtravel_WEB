import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { useGetProfileQuery } from "../../store/apis/authApi";
import { useGetCurrentProviderPackageQuery, useGetProviderStatsQuery } from "../../store/apis/providerApi";
import { useGetExploreGridQuery } from "../../store/apis/exploreApi";
import { PartnerBadge } from "@/components/ui/PartnerBadge";

import { Star, MessageSquare, Eye, Award, ArrowRight, ShieldCheck, Calendar, ConciergeBell } from "lucide-react";

export default function ProviderDashboard() {
  const user = useAppSelector((state) => state.auth.user);

  // Fetch KPI statistics and package information
  const { data: kpis, isLoading: isKpisLoading } = useGetProviderStatsQuery();
  const { data: currentPackage, isLoading: isPkgLoading } = useGetCurrentProviderPackageQuery();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const { data: promotedList, isLoading: isPromotedLoading } = useGetExploreGridQuery({});

  const isLoading = isKpisLoading || isPkgLoading || isProfileLoading || isPromotedLoading;

  // Render Skeleton Loaders
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) =>
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          )}
        </div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>);

  }

  const providerId = profile?.maNhaCungCap;
  const promotedItems = Array.isArray(promotedList) ? promotedList : promotedList?.items || promotedList?.data || [];
  const promoInfo = promotedItems.find((p) => p.providerId === providerId);
  const badgeType = promoInfo?.badgeType && promoInfo.badgeType !== "NONE" ? promoInfo.badgeType : null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-950 dark:text-slate-50">
            Tổng quan Nhà cung cấp
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chào mừng trở lại, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.fullName || user?.email}</span>. Quản lý trạng thái gói cước và hiệu suất quảng bá của bạn.
          </p>
        </div>
        {badgeType &&
        <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Trạng thái:</span>
            <PartnerBadge type={badgeType} />
          </div>
        }
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Package Name & Status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                Gói hiện tại
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-1 block">
                {currentPackage?.tenGoi || "Gói Miễn Phí"}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Trạng thái:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
              {currentPackage?.trangThai || "ACTIVE"}
            </span>
          </div>
        </div>

        {/* Expiry Date */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                Ngày hết hạn
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-50 mt-1 block">
                {currentPackage?.ngayKetThuc ?
                new Date(currentPackage.ngayKetThuc).toLocaleDateString("vi-VN") :
                "Vô thời hạn"}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            {currentPackage?.ngayBatDau &&
            <span>
                Bắt đầu từ: {new Date(currentPackage.ngayBatDau).toLocaleDateString("vi-VN")}
              </span>
            }
          </div>
        </div>

        {/* Total & Active Services */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                Dịch vụ của bạn
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1 block">
                {kpis?.totalServices || 0}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
              <ConciergeBell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Đang hoạt động:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {kpis?.activeServices || 0}
            </span>
          </div>
        </div>

        {/* Rating & Review Count */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                Đánh giá trung bình
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {kpis?.averageRating?.toFixed(1) || "0.0"}
                </span>
                <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400">
              <Star className="w-5 h-5 fill-teal-600 dark:fill-teal-400" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Tổng lượt đánh giá:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> {kpis?.totalReviews || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Views Metric (Unavailable) & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Views KPI Card (Unavailable / Sắp ra mắt) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                Lượt xem dịch vụ
              </span>
              <span className="text-lg font-bold text-slate-400 dark:text-slate-600 mt-2 block italic">
                Chưa hỗ trợ
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Sắp ra mắt ở Sprint sau</span>
          </div>
        </div>

        {/* Visibility Boost Panel */}
        <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 dark:from-teal-950/20 dark:to-emerald-950/20 p-6 rounded-2xl border border-teal-500/20 dark:border-teal-900/30 shadow-sm flex flex-col justify-between lg:col-span-2 h-48">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Đặc quyền gói cước hiện tại
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed max-w-xl">
              {currentPackage?.tenGoi ?
              `Doanh nghiệp của bạn đang được hưởng đặc quyền hiển thị từ gói ${currentPackage.tenGoi}. Để gia tăng lượng khách hàng tiềm năng, hãy nâng cấp lên gói Premium để nhận các ưu đãi hiển thị tối ưu nhất.` :
              "Doanh nghiệp của bạn đang sử dụng gói dịch vụ mặc định. Nâng cấp gói Commercial để nhận được huy hiệu đối tác nổi bật và tăng thứ hạng hiển thị dịch vụ khi khách hàng tìm kiếm."}
            </p>
          </div>
          <div className="flex gap-4 mt-4">
            <Link
              to="/provider/packages"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:gap-2 transition-all">
              
              Xem ưu đãi hiển thị <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/provider/packages"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white">
              
              Nâng cấp gói <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>);

}
