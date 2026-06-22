import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AUTH_ROUTES, PUBLIC_ROUTES, PREMIUM_ROUTES } from "../../router/routes";
import {
  AlertCircle,
  Bell,
  Bookmark,
  CalendarDays,
  ChevronRight,
  Compass,
  Globe2,
  Loader2,
  Map,
  MapPin,
  MessageSquare,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  useGetDashboardStatsQuery,
  useGetUpcomingTripsQuery,
} from "../../store/apis/plannerApi";
import { useGetNotificationsQuery } from "../../store/apis/communityApi";

const DEFAULT_TRIP_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=80";

const statusLabels = {
  DRAFT: "Bản nháp",
  PLANNED: "Đã lên kế hoạch",
  ONGOING: "Đang diễn ra",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
  PUBLIC: "Công khai",
};

const formatDate = (value) => {
  if (!value) return "Chua co ngay";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chua co ngay";
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
};

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getTripId = (trip) => trip.id ?? trip.maLichTrinh;
const getTripTitle = (trip) => trip.title ?? trip.tenLichTrinh ?? "Chuyen di";
const getTripStart = (trip) => trip.startDate ?? trip.ngayBatDau;
const getTripEnd = (trip) => trip.endDate ?? trip.ngayKetThuc;
const getTripStatus = (trip) => trip.trangThai ?? trip.status ?? "DRAFT";

const getDuration = (trip) => {
  const start = new Date(getTripStart(trip));
  const end = new Date(getTripEnd(trip));
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
};

export default function TravelerDashboard() {
  const { user } = useAuth();
  const {
    data: stats = {},
    isLoading: isLoadingStats,
    isError: isStatsError,
    refetch: refetchStats,
  } = useGetDashboardStatsQuery();
  const {
    data: upcomingData = [],
    isLoading: isLoadingTrips,
    isError: isTripsError,
    refetch: refetchTrips,
  } = useGetUpcomingTripsQuery();
  const {
    data: notificationData = [],
    isLoading: isLoadingNotifications,
    isError: isNotificationsError,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery();

  const upcomingTrips = Array.isArray(upcomingData)
    ? upcomingData
    : upcomingData?.items ?? upcomingData?.data ?? [];
  const notifications = Array.isArray(notificationData)
    ? notificationData
    : notificationData?.items ?? notificationData?.data ?? [];
  const recentNotifications = notifications.slice(0, 5);

  const statItems = [
    { label: "Tổng chuyến đi", value: stats.totalTrips ?? 0, icon: Map, color: "text-sky-600 bg-sky-50" },
    { label: "Sắp tới", value: stats.upcomingTrips ?? 0, icon: CalendarDays, color: "text-emerald-600 bg-emerald-50" },
    { label: "Công khai", value: stats.publicTrips ?? 0, icon: Globe2, color: "text-amber-600 bg-amber-50" },
    { label: "Đã lưu", value: stats.savedTrips ?? 0, icon: Bookmark, color: "text-rose-600 bg-rose-50" },
  ];

  const refetchDashboard = () => {
    refetchStats();
    refetchTrips();
    refetchNotifications();
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8 pb-14">
      <section className="flex flex-col gap-5 border-b pb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Xin chào, {user?.fullName || "Traveler"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Theo dõi các chuyến đi và tiếp tục kế hoạch của bạn.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to={PUBLIC_ROUTES.EXPLORE}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <Compass className="h-4 w-4" />
            Kham pha
          </Link>
          <Link
            to={AUTH_ROUTES.TRIP_CREATE}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Tao chuyen di
          </Link>
        </div>
      </section>

      {isStatsError ? (
        <div className="flex items-center justify-between gap-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span className="inline-flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Không thể tải tổng quan dashboard.
          </span>
          <button type="button" className="font-semibold underline" onClick={refetchDashboard}>
            Thử lại
          </button>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-md border bg-background p-5 shadow-sm">
                <div className={`flex h-10 w-10 items-center justify-center rounded-md ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-2xl font-bold text-foreground">
                  {isLoadingStats ? <Loader2 className="h-5 w-5 animate-spin" /> : item.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </div>
            );
          })}
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to={AUTH_ROUTES.TRIPS}
          className="flex items-center gap-3 rounded-md border bg-background p-4 transition hover:border-primary/40 hover:bg-muted/30"
        >
          <Map className="h-5 w-5 text-sky-600" />
          <span className="text-sm font-semibold text-foreground">Chuyến đi của tôi</span>
        </Link>
        <Link
          to={PUBLIC_ROUTES.COMMUNITY}
          className="flex items-center gap-3 rounded-md border bg-background p-4 transition hover:border-primary/40 hover:bg-muted/30"
        >
          <MessageSquare className="h-5 w-5 text-emerald-600" />
          <span className="text-sm font-semibold text-foreground">Cộng đồng</span>
        </Link>
        <Link
          to={PREMIUM_ROUTES.AI_PLANNER}
          className="flex items-center gap-3 rounded-md border bg-background p-4 transition hover:border-primary/40 hover:bg-muted/30"
        >
          <Sparkles className="h-5 w-5 text-amber-600" />
          <span className="text-sm font-semibold text-foreground">AI Planner</span>
        </Link>
        <Link
          to={AUTH_ROUTES.PROFILE}
          className="flex items-center gap-3 rounded-md border bg-background p-4 transition hover:border-primary/40 hover:bg-muted/30"
        >
          <Globe2 className="h-5 w-5 text-rose-600" />
          <span className="text-sm font-semibold text-foreground">Hồ sơ cá nhân</span>
        </Link>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Lịch trình sắp tới</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tối đa 5 chuyến đi gần nhất từ dữ liệu hiện tại.</p>
            </div>
            <Link
              to={AUTH_ROUTES.TRIPS}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Xem tat ca
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoadingTrips ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-64 animate-pulse rounded-md border bg-muted/40" />
              ))}
            </div>
          ) : isTripsError ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Không thể tải lịch trình sắp tới.{" "}
              <button className="font-semibold underline" type="button" onClick={() => refetchTrips()}>
                Thử lại
              </button>
            </div>
          ) : upcomingTrips.length === 0 ? (
            <div className="rounded-md border bg-background px-5 py-12 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-4 font-bold text-foreground">Chưa có chuyến đi sắp tới</h3>
              <p className="mt-2 text-sm text-muted-foreground">Tạo lịch trình mới để bắt đầu lên kế hoạch.</p>
              <Link
                to={AUTH_ROUTES.TRIP_CREATE}
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Tạo chuyến đi
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {upcomingTrips.map((trip) => {
                const id = getTripId(trip);
                const status = getTripStatus(trip);
                return (
                  <Link
                    key={id}
                    to={AUTH_ROUTES.TRIP_DETAILS.replace(":id", id)}
                    className="group overflow-hidden rounded-md border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative h-40 overflow-hidden bg-muted">
                      <img
                        src={trip.thumbnail || DEFAULT_TRIP_IMAGE}
                        alt={getTripTitle(trip)}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute right-3 top-3 rounded bg-background/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                        {statusLabels[status] ?? status}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 font-bold text-foreground group-hover:text-primary">
                        {getTripTitle(trip)}
                      </h3>
                      <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                        <p className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(getTripStart(trip))} - {formatDate(getTripEnd(trip))}
                        </p>
                        <div className="flex items-center justify-between gap-3">
                          <span>{getDuration(trip)} ngay</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {trip.soLuongDiaDiem ?? 0} địa điểm
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <aside className="h-fit rounded-md border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className="inline-flex items-center gap-2 font-bold text-foreground">
                <Bell className="h-4 w-4 text-primary" />
                Thông báo gần đây
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {notifications.filter((item) => !(item.isRead ?? item.daDoc)).length} chưa đọc
              </p>
            </div>
            <Link to={AUTH_ROUTES.NOTIFICATIONS} className="text-xs font-semibold text-primary hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="mt-4 space-y-1">
            {isLoadingNotifications ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : isNotificationsError ? (
              <div className="py-6 text-center text-sm text-red-600">
                <p>Không thể tải thông báo.</p>
                <button type="button" className="mt-2 font-semibold underline" onClick={() => refetchNotifications()}>
                  Thử lại
                </button>
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Chưa có thông báo.</div>
            ) : (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id ?? notification.maThongBao}
                  className={`rounded-md px-3 py-3 ${
                    notification.isRead ?? notification.daDoc ? "bg-background" : "bg-primary/5"
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground">
                    {notification.title ?? notification.tieuDe ?? "Thông báo"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {notification.content ?? notification.message ?? notification.noiDung ?? ""}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground/80">
                    {formatDateTime(notification.createdAt ?? notification.ngayTao)}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
