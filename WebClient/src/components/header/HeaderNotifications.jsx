import { useEffect, useRef, useState } from 'react';
import { Bell, Check, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AUTH_ROUTES } from '../../router/routes';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from '../../store/apis/communityApi';

const getNotificationId = (notification) =>
  notification.id ?? notification.maThongBao ?? null;

const getNotificationTitle = (notification) =>
  notification.title ?? notification.tieuDe ?? 'Thông báo';

const getNotificationContent = (notification) =>
  notification.content ?? notification.message ?? notification.noiDung ?? '';

const isNotificationRead = (notification) =>
  Boolean(notification.isRead ?? notification.daDoc);

const formatDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export function HeaderNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data = [], isFetching } = useGetNotificationsQuery();
  const [markAsRead, { isLoading: isMarking }] = useMarkNotificationReadMutation();

  const notifications = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
  const unreadCount = notifications.filter((notification) => !isNotificationRead(notification)).length;
  const previewNotifications = notifications.slice(0, 6);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notification) => {
    const id = getNotificationId(notification);
    if (id === null || isNotificationRead(notification)) return;

    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Thông báo"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full border-2 border-background bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-[220] mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-md border bg-background shadow-xl ring-1 ring-black/5">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Thông báo</p>
              <p className="text-xs text-muted-foreground">{unreadCount} chưa đọc</p>
            </div>
            {isFetching && <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {previewNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Chưa có thông báo.
              </div>
            ) : (
              previewNotifications.map((notification) => {
                const id = getNotificationId(notification);
                const read = isNotificationRead(notification);

                return (
                  <button
                    key={id ?? `${getNotificationTitle(notification)}-${notification.createdAt}`}
                    type="button"
                    className={`flex w-full gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/60 ${
                      read ? 'bg-background' : 'bg-primary/5'
                    }`}
                    disabled={isMarking}
                    onClick={() => handleMarkAsRead(notification)}
                  >
                    <span
                      className={`mt-1 flex h-2.5 w-2.5 shrink-0 rounded-full ${
                        read ? 'bg-muted-foreground/30' : 'bg-primary'
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {getNotificationTitle(notification)}
                      </span>
                      <span className="mt-1 block line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {getNotificationContent(notification)}
                      </span>
                      <span className="mt-1 block text-[11px] text-muted-foreground/80">
                        {formatDateTime(notification.createdAt ?? notification.ngayTao)}
                      </span>
                    </span>
                    {read && <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />}
                  </button>
                );
              })
            )}
          </div>

          <Link
            to={AUTH_ROUTES.NOTIFICATIONS}
            className="block border-t px-4 py-3 text-center text-sm font-semibold text-primary transition-colors hover:bg-muted"
            onClick={() => setIsOpen(false)}
          >
            Xem tất cả
          </Link>
        </div>
      )}
    </div>
  );
}
