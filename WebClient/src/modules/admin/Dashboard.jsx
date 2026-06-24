import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  Briefcase,
  Clock,
  DollarSign,
  FolderCog,
  Loader2,
  MapPin,
  MoreVertical,
  Package,
  RefreshCw,
  Route,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
  Activity,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAdminStatsQuery } from "../../store/apis/adminApi";
import { ADMIN_ROUTES } from "../../router/routes";

export default function AdminDashboard() {
  const { data: dashboard, isLoading, isError, refetch } = useGetAdminStatsQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center" role="status">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-red-500" aria-hidden="true" />
          Đang tải dữ liệu tổng quan...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-5 py-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tổng quan hệ thống</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Không thể tải các chỉ số hiện có từ backend.
          </p>
        </div>
        <div className="flex max-w-xl items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold">Dữ liệu tổng quan tạm thời chưa khả dụng.</p>
            <p className="mt-1 text-red-700">
              Kiểm tra kết nối mạng hoặc tải lại trang.
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" onClick={refetch}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Thử lại
        </Button>
      </div>
    );
  }

  const stats = {
    totalUsers: Number(dashboard?.totalUsers ?? 0),
    newUsers: Number(dashboard?.recentUsers?.length ?? 0),
    totalTrips: Number(dashboard?.totalTrips ?? 0),
    revenue: Number(dashboard?.totalRevenue ?? 0),
    activeProviders: Number(dashboard?.totalProviders ?? 0) - Number(dashboard?.pendingProviders ?? 0),
    pendingProviders: Number(dashboard?.pendingProviders ?? 0),
    pendingReports: Number(dashboard?.pendingReports ?? 0),
    pendingReviews: Number(dashboard?.pendingReviews ?? 0),
  };

  const actionItemsCount = stats.pendingProviders + stats.pendingReports + stats.pendingReviews;
  const recentUsers = dashboard?.recentUsers ?? [];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tổng quan hệ thống</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Theo dõi các chỉ số hoạt động và tình hình kinh doanh của ezTravel.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-100 px-3 py-1.5 rounded-md">
            <Calendar className="w-4 h-4" />
            <span>Tháng này (Tháng 6, 2026)</span>
          </div>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh thu */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng doanh thu</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {(stats.revenue / 1000000).toLocaleString('vi-VN')}M ₫
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3" /> +12.5%
            </span>
            <span className="text-muted-foreground">so với tháng trước</span>
          </div>
        </div>

        {/* Người dùng */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng người dùng</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {stats.totalUsers.toLocaleString('vi-VN')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3" /> +{stats.newUsers}
            </span>
            <span className="text-muted-foreground">người dùng mới</span>
          </div>
        </div>

        {/* Lịch trình */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lịch trình đã tạo</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {stats.totalTrips.toLocaleString('vi-VN')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <Route className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3" /> +8.2%
            </span>
            <span className="text-muted-foreground">so với tháng trước</span>
          </div>
        </div>

        {/* Đối tác */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đối tác hoạt động</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {stats.activeProviders.toLocaleString('vi-VN')}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-red-600 font-medium bg-red-50 px-1.5 py-0.5 rounded">
              <TrendingDown className="w-3 h-3" /> -2
            </span>
            <span className="text-muted-foreground">đối tác ngừng HĐ</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts/Graphs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Chart Placeholder */}
          <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-foreground">Biểu đồ doanh thu</h2>
              <select className="text-sm border-border rounded-md text-muted-foreground bg-slate-50 outline-none px-2 py-1">
                <option>6 tháng qua</option>
                <option>Năm nay</option>
              </select>
            </div>
            {/* CSS Mock Chart */}
            <div className="h-64 flex items-end gap-2 px-2 pb-6 border-b border-l border-slate-200 relative">
              <div className="absolute top-0 left-0 w-full flex justify-between text-xs text-slate-400 px-2 -translate-y-4">
                <span>150M</span>
              </div>
              <div className="absolute top-1/2 left-0 w-full flex justify-between text-xs text-slate-400 px-2 -translate-y-4 border-t border-dashed border-slate-200">
                <span>75M</span>
              </div>
              
              {/* Bars */}
              {[40, 65, 45, 80, 55, 95].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <div className="w-full max-w-[40px] bg-blue-100 rounded-t-sm relative group-hover:bg-blue-200 transition-colors" style={{ height: `${h}%` }}>
                    <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm group-hover:bg-blue-600 transition-colors" style={{ height: `${h * 0.7}%` }}></div>
                  </div>
                  <span className="text-xs text-muted-foreground mt-2">Th {i + 1}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div> Gói Premium
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-blue-100"></div> Gói Provider
              </div>
            </div>
          </div>

          {/* Quick Access Modules */}
          <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border bg-slate-50/50">
              <h2 className="text-lg font-bold text-foreground">Khu vực vận hành</h2>
              <p className="text-sm text-muted-foreground mt-1">Truy cập nhanh các module quản trị quan trọng.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
              <Link to={ADMIN_ROUTES.USERS} className="p-5 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">Quản lý Người dùng</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Xử lý tài khoản & phân quyền</p>
                  </div>
                </div>
              </Link>
              <Link to="/admin/reports" className="p-5 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-orange-600 transition-colors">Kiểm duyệt & Báo cáo</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">28 báo cáo vi phạm cần xử lý</p>
                  </div>
                </div>
              </Link>
              <Link className="p-5 hover:bg-slate-50 transition-colors group border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <BadgeDollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-emerald-600 transition-colors">Gói Nhà cung cấp</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Cấu hình giá & quyền lợi</p>
                  </div>
                </div>
              </Link>
              <Link to={ADMIN_ROUTES.CATEGORIES} className="p-5 hover:bg-slate-50 transition-colors group border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <FolderCog className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-purple-600 transition-colors">Quản lý Danh mục</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Từ khóa & tag hệ thống</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* Right Column: Alerts & Recent Activity */}
        <div className="space-y-6">
          
          {/* Action Items */}
          <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-500" /> Cần xử lý
              </h2>
              {actionItemsCount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{actionItemsCount}</span>
              )}
            </div>
            <div className="divide-y divide-border">
              {stats.pendingProviders > 0 && (
                <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-sm font-semibold text-foreground">Duyệt hồ sơ Đối tác mới</p>
                  <p className="text-xs text-muted-foreground mt-1">Có {stats.pendingProviders} hồ sơ nhà cung cấp đang chờ được phê duyệt.</p>
                  <div className="mt-3">
                    <Link to={ADMIN_ROUTES.PROVIDER_PACKAGES} className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-md w-full">Xem danh sách</Link>
                  </div>
                </div>
              )}
              {stats.pendingReports > 0 && (
                <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-sm font-semibold text-foreground">Báo cáo người dùng</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.pendingReports} nội dung bị báo cáo cần xử lý.</p>
                  <div className="mt-3">
                    <Link to={ADMIN_ROUTES.MODERATION} className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-100 rounded-md w-full">Kiểm duyệt ngay</Link>
                  </div>
                </div>
              )}
              {stats.pendingReviews > 0 && (
                <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-sm font-semibold text-foreground">Đánh giá dịch vụ</p>
                  <p className="text-xs text-muted-foreground mt-1">Có {stats.pendingReviews} đánh giá đang chờ duyệt.</p>
                  <div className="mt-3">
                    <Link to={ADMIN_ROUTES.MODERATION} className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium text-purple-600 border border-purple-200 bg-purple-50 hover:bg-purple-100 rounded-md w-full">Kiểm duyệt ngay</Link>
                  </div>
                </div>
              )}
              {actionItemsCount === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Hiện không có công việc nào cần xử lý khẩn cấp.
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="font-bold text-foreground">Người dùng mới đăng ký</h2>
              <Link to={ADMIN_ROUTES.USERS} className="text-xs text-blue-600 hover:underline">Xem tất cả</Link>
            </div>
            <div className="p-4 space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground"><span className="font-semibold">{user.hoTen}</span> ({user.email}) vừa tham gia hệ thống.</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 
                      {new Date(user.createdAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' })} 
                      <span className="ml-2 font-medium text-slate-500">[{user.role}]</span>
                    </p>
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">Chưa có dữ liệu người dùng mới.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
