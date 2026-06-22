import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from "@/store/apis/communityApi";

export function NotificationDropdown() {
  const { data: notifications = [] } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationReadMutation();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch {
      console.error("Failed to mark notification as read");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative text-white hover:bg-slate-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border rounded-md shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white">Thông báo</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">
                Chưa có thông báo nào.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 cursor-pointer flex flex-col items-start border-b border-slate-50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    !notif.isRead ? "bg-slate-50 dark:bg-slate-800 font-medium text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"
                  }`}
                  onClick={() => {
                    if (!notif.isRead) handleRead(notif.id);
                  }}
                >
                  <div className="text-sm">{notif.message}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}


