import { useMemo } from "react";
import { Bell, Check, CheckCheck, LoaderCircle, RefreshCw } from "lucide-react";
import {
 useGetNotificationsQuery,
 useMarkNotificationReadMutation,
} from "../../store/apis/communityApi";
import PageHero from "@/shared/components/PageHero";

const getNotificationId = (notification) =>
 notification.id ?? notification.maThongBao ?? null;

const getNotificationTitle = (notification) =>
 notification.title ?? notification.tieuDe ?? "Thông báo";

const getNotificationContent = (notification) =>
 notification.content ?? notification.message ?? notification.noiDung ?? "";

const isNotificationRead = (notification) =>
 Boolean(notification.isRead ?? notification.daDoc);

const formatDateTime = (value) => {
 if (!value) return "";
 const date = new Date(value);
 if (Number.isNaN(date.getTime())) return "";

 return new Intl.DateTimeFormat("vi-VN", {
 dateStyle: "medium",
 timeStyle: "short",
 }).format(date);
};

export default function Notifications() {
 const {
 data = [],
 isLoading,
 isFetching,
 isError,
 refetch,
 } = useGetNotificationsQuery();
 const [markAsRead, { isLoading: isMarking }] = useMarkNotificationReadMutation();

 const notifications = useMemo(
 () => (Array.isArray(data) ? data : data?.items ?? data?.data ?? []),
 [data]
 );

 const unreadNotifications = notifications.filter(
 (notification) => !isNotificationRead(notification)
 );

 const handleMarkAsRead = async (notification) => {
 const id = getNotificationId(notification);
 if (id === null || isNotificationRead(notification)) return;
 await markAsRead(id).unwrap();
 };

 const handleMarkAllAsRead = async () => {
 for (const notification of unreadNotifications) {
 const id = getNotificationId(notification);
 if (id !== null) {
 await markAsRead(id).unwrap();
 }
 }
 };

 return (
 <div className="w-full">
 <PageHero
 title="Thông báo"
 description={`${unreadNotifications.length} thông báo chưa đọc trong ${notifications.length} thông báo.`}
 bgImage="/images/bg_2.jpg"
 />
 <div className="container mx-auto w-full max-w-5xl px-4 py-8">
 <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-end">

 <div className="flex flex-wrap items-center gap-2">
 <button
 type="button"
 className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
 disabled={isFetching}
 onClick={() => refetch()}
 >
 <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
 Lam moi
 </button>

 <button
 type="button"
 className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
 disabled={unreadNotifications.length === 0 || isMarking}
 onClick={handleMarkAllAsRead}
 >
 <CheckCheck className="h-4 w-4" />
 Danh dau da doc
 </button>
 </div>
 </div>

 {isLoading ? (
 <div className="flex min-h-[260px] items-center justify-center rounded-md border bg-background">
 <div className="text-center">
 <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-primary" />
 <p className="mt-3 text-sm text-muted-foreground">Đang tải thông báo...</p>
 </div>
 </div>
 ) : isError ? (
 <div className="rounded-md border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
 Không thể tải thông báo. Vui lòng thử lại.
 </div>
 ) : notifications.length === 0 ? (
 <div className="flex min-h-[260px] flex-col items-center justify-center rounded-md border bg-background px-4 text-center">
 <Bell className="h-10 w-10 text-muted-foreground/60" />
 <h2 className="mt-4 text-lg font-semibold text-foreground">Chưa có thông báo</h2>
 <p className="mt-1 text-sm text-muted-foreground">
 Cac cap nhat quan trong se hien thi o day.
 </p>
 </div>
 ) : (
 <div className="overflow-hidden rounded-md border bg-background">
 {notifications.map((notification) => {
 const id = getNotificationId(notification);
 const read = isNotificationRead(notification);

 return (
 <button
 key={id ?? `${getNotificationTitle(notification)}-${notification.createdAt}`}
 type="button"
 className={`flex w-full gap-4 border-b px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-muted/60 ${
 read ? "bg-background" : "bg-primary/5"
 }`}
 disabled={isMarking}
 onClick={() => handleMarkAsRead(notification)}
 >
 <span
 className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
 read ? "bg-muted-foreground/30" : "bg-primary"
 }`}
 />

 <span className="min-w-0 flex-1">
 <span className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
 <span className="font-semibold text-foreground">
 {getNotificationTitle(notification)}
 </span>
 <span className="text-xs text-muted-foreground">
 {formatDateTime(notification.createdAt ?? notification.ngayTao)}
 </span>
 </span>
 <span className="mt-1 block text-sm leading-6 text-muted-foreground">
 {getNotificationContent(notification)}
 </span>
 </span>

 {read && <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />}
 </button>
 );
 })}
 </div>
 )}
      </div>
    </div>
  );
}
