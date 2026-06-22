import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  FolderCog,
  Loader2,
  RefreshCw,
  Route,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAdminStatsQuery } from "../../store/apis/adminApi";
import { ADMIN_ROUTES } from "../../router/routes";

const operationalLinks = [
  {
    label: "Người dùng",
    description: "Tìm kiếm, kiểm tra vai trò và khóa hoặc mở khóa tài khoản.",
    to: ADMIN_ROUTES.USERS,
    icon: Users,
  },
  {
    label: "Kiểm duyệt",
    description: "Xử lý báo cáo và hồ sơ nhà cung cấp đang chờ.",
    to: ADMIN_ROUTES.MODERATION,
    icon: ShieldCheck,
  },
  {
    label: "Danh mục",
    description: "Quản lý các tag dùng chung đang hoạt động.",
    to: ADMIN_ROUTES.CATEGORIES,
    icon: FolderCog,
  },
  {
    label: "Gói nhà cung cấp",
    description: "Quản lý giá, hệ số ưu tiên và quyền lợi hiển thị.",
    to: ADMIN_ROUTES.PROVIDER_PACKAGES,
    icon: BadgeDollarSign,
  },
];

export default function AdminDashboard() {
  const { data: dashboard, isLoading, isError, refetch } =
    useGetAdminStatsQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center" role="status">
        <div className="flex items-center gap-3 text-sm text-slate-500">
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
          <h1 className="page-title">Tổng quan hệ thống</h1>
          <p className="page-description">
            Không thể tải các chỉ số hiện có từ backend.
          </p>
        </div>
        <div className="flex max-w-xl items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold">Dữ liệu tổng quan tạm thời chưa khả dụng.</p>
            <p className="mt-1 text-red-700">
              Kiểm tra kết nối Gateway hoặc tải lại trang.
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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="page-title">Tổng quan hệ thống</h1>
        <p className="page-description">
          Theo dõi các chỉ số backend đang cung cấp và mở nhanh các khu vực quản trị đang hoạt động.
        </p>
      </header>

      <section className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2" aria-label="Chỉ số tổng quan">
        <div className="flex items-center gap-4 border-b border-slate-200 p-5 sm:border-b-0 sm:border-r">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600">
            <Users className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm text-slate-500">Tổng người dùng</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">
              {Number(dashboard?.totalUsers ?? 0).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-teal-600">
            <Route className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm text-slate-500">Tổng lịch trình</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">
              {Number(dashboard?.totalTrips ?? 0).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="admin-operations-title">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 id="admin-operations-title" className="text-lg font-semibold text-slate-950">
              Khu vực vận hành
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Chỉ hiển thị các module đã có route và API đang dùng được.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-200 overflow-hidden rounded-md border border-slate-200 bg-white">
          {operationalLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 sm:p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 group-hover:bg-red-50 group-hover:text-red-600">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                <span className="mt-1 block text-sm leading-5 text-slate-500">{item.description}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-red-500" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
