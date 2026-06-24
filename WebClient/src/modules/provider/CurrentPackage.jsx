import { useGetCurrentProviderPackageQuery } from "../../store/apis/providerApi";

import EmptyState from "../../features/explore/components/EmptyState";

import { Calendar, CheckCircle2, XCircle, Award, Compass, Search, Home } from "lucide-react";

export default function ProviderCurrentPackage() {
 const { data: currentPackage, isLoading } = useGetCurrentProviderPackageQuery();

 if (isLoading) {
 return (
 <div className="space-y-6 animate-pulse max-w-4xl mx-auto py-4">
 <div className="h-10 w-48 bg-slate-200 rounded-md" />
 <div className="h-48 bg-slate-200 rounded-2xl" />
 <div className="h-64 bg-slate-200 rounded-2xl" />
 </div>);

 }

 if (!currentPackage || !currentPackage.maGoiNcc) {
 return (
 <div className="max-w-4xl mx-auto py-8">
 <h3 className="text-2xl font-sans font-bold text-foreground mb-6">
 Gói cước hiện tại
 </h3>
 <EmptyState
 title="Chưa kích hoạt gói cước"
 description="Hiện tại doanh nghiệp của bạn chưa đăng ký gói dịch vụ Commercial nào trên hệ thống ezTravel."
 icon={Award} />
 
 </div>);

 }

 return (
 <div className="space-y-8 max-w-4xl mx-auto py-4">
 {/* Title */}
 <div>
 <h3 className="text-2xl font-sans font-bold text-foreground ">
 Gói cước hiện tại
 </h3>
 <p className="text-xs text-muted-foreground mt-1">
 Xem thông tin chi tiết và quyền lợi hiển thị từ gói cước dịch vụ đang kích hoạt.
 </p>
 </div>

 {/* Package Main Info Card */}
 <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
 <div className="bg-gradient-to-r from-teal-500/10 to-sky-500/10 p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
 Gói dịch vụ
 </span>
 <h4 className="text-xl font-bold text-foreground mt-1">
 {currentPackage.tenGoi}
 </h4>
 </div>
 <div className="flex items-center gap-2">
 <span className="text-xs text-muted-foreground">Trạng thái:</span>
 <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full">
 <CheckCircle2 className="w-3.5 h-3.5" />
 {currentPackage.trangThai || "ACTIVE"}
 </span>
 </div>
 </div>

 <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <Calendar className="w-4 h-4 text-muted-foreground" />
 <div>
 <span className="text-muted-foreground text-xs block">Ngày bắt đầu</span>
 <span className="font-semibold text-foreground ">
 {new Date(currentPackage.ngayBatDau).toLocaleDateString("vi-VN")}
 </span>
 </div>
 </div>
 </div>
 <div className="space-y-4">
 <div className="flex items-center gap-3">
 <Calendar className="w-4 h-4 text-muted-foreground" />
 <div>
 <span className="text-muted-foreground text-xs block">Ngày kết thúc</span>
 <span className="font-semibold text-foreground ">
 {currentPackage.ngayKetThuc ?
 new Date(currentPackage.ngayKetThuc).toLocaleDateString("vi-VN") :
 "Vô thời hạn"}
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Package Benefits Details */}
 <div className="bg-background rounded-2xl border border-border shadow-sm p-6 space-y-6">
 <div>
 <h4 className="text-base font-bold text-foreground ">
 Quyền lợi hiển thị & Quảng bá
 </h4>
 <p className="text-xs text-muted-foreground mt-1">
 Các quyền lợi hiển thị doanh nghiệp được kích hoạt trực tiếp dựa trên gói cước của bạn.
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {/* Benefit 1: Search Visibility */}
 <div className={`p-4 rounded-xl border flex flex-col justify-between ${
 currentPackage.uuTienTimKiem ?
 "border-teal-500/20 bg-teal-500/5 dark:bg-teal-950/10" :
 "border-border bg-background/50 opacity-60"}`
 }>
 <div className="space-y-2">
 <div className="flex justify-between items-center">
 <Search className={`w-5 h-5 ${currentPackage.uuTienTimKiem ? "text-teal-600 dark:text-teal-400" : "text-muted-foreground"}`} />
 {currentPackage.uuTienTimKiem ?
 <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :

 <XCircle className="w-4 h-4 text-muted-foreground" />
 }
 </div>
 <h5 className="font-bold text-xs text-foreground ">
 Search Visibility
 </h5>
 <p className="text-[11px] text-muted-foreground leading-normal">
 Ưu tiên đẩy thứ hạng các dịch vụ của doanh nghiệp khi khách hàng thực hiện tìm kiếm trên thanh công cụ.
 </p>
 </div>
 <div className="text-[10px] font-semibold mt-3 text-muted-foreground">
 Trạng thái: {currentPackage.uuTienTimKiem ? "Đang hoạt động" : "Không hỗ trợ"}
 </div>
 </div>

 {/* Benefit 2: Homepage Visibility */}
 <div className={`p-4 rounded-xl border flex flex-col justify-between ${
 currentPackage.uuTienTrangChu ?
 "border-teal-500/20 bg-teal-500/5 dark:bg-teal-950/10" :
 "border-border bg-background/50 opacity-60"}`
 }>
 <div className="space-y-2">
 <div className="flex justify-between items-center">
 <Home className={`w-5 h-5 ${currentPackage.uuTienTrangChu ? "text-teal-600 dark:text-teal-400" : "text-muted-foreground"}`} />
 {currentPackage.uuTienTrangChu ?
 <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :

 <XCircle className="w-4 h-4 text-muted-foreground" />
 }
 </div>
 <h5 className="font-bold text-xs text-foreground ">
 Homepage Visibility
 </h5>
 <p className="text-[11px] text-muted-foreground leading-normal">
 Tự động hiển thị dịch vụ trong mục Đối tác nổi bật tại trang chủ, gia tăng lượt tiếp cận tự nhiên.
 </p>
 </div>
 <div className="text-[10px] font-semibold mt-3 text-muted-foreground">
 Trạng thái: {currentPackage.uuTienTrangChu ? "Đang hoạt động" : "Không hỗ trợ"}
 </div>
 </div>

 {/* Benefit 3: Explore Visibility */}
 <div className={`p-4 rounded-xl border flex flex-col justify-between ${
 currentPackage.heSoUuTien > 1.0 ?
 "border-teal-500/20 bg-teal-500/5 dark:bg-teal-950/10" :
 "border-border bg-background/50 opacity-60"}`
 }>
 <div className="space-y-2">
 <div className="flex justify-between items-center">
 <Compass className={`w-5 h-5 ${currentPackage.heSoUuTien > 1.0 ? "text-teal-600 dark:text-teal-400" : "text-muted-foreground"}`} />
 {currentPackage.heSoUuTien > 1.0 ?
 <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :

 <XCircle className="w-4 h-4 text-muted-foreground" />
 }
 </div>
 <h5 className="font-bold text-xs text-foreground ">
 Explore Visibility
 </h5>
 <p className="text-[11px] text-muted-foreground leading-normal">
 Hệ số ưu tiên đẩy thứ hạng các địa điểm/dịch vụ tại trang Khám Phá (Hệ số: {currentPackage.heSoUuTien}).
 </p>
 </div>
 <div className="text-[10px] font-semibold mt-3 text-muted-foreground">
 Trạng thái: {currentPackage.heSoUuTien > 1.0 ? "Đang hoạt động" : "Không hỗ trợ"}
 </div>
 </div>
 </div>
 </div>
 </div>);

}
