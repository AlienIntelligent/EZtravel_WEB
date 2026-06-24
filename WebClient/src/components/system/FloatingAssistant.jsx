import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bot, MessageSquareText, Sparkles, Map, X } from "lucide-react";
import { PREMIUM_ROUTES } from "@/router/routes";

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();



  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Hide floating assistant on auth pages and admin pages
  if (location.pathname.startsWith("/auth") || location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]" ref={menuRef}>
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 w-[280px] rounded-2xl border border-border bg-background shadow-xl ring-1 ring-black/5 animate-in slide-in-from-bottom-5 fade-in duration-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold text-sm">Trợ lý ảo ezTravel</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-2 flex flex-col gap-1 bg-slate-50 dark:bg-slate-900/50">
            <Link 
              to={PREMIUM_ROUTES.AI_CHAT}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-3 text-sm text-foreground bg-background border border-transparent rounded-xl hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm group"
            >
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <MessageSquareText className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-medium">Chat hỗ trợ</span>
                <span className="block text-xs text-muted-foreground mt-0.5">Giải đáp thắc mắc dịch vụ</span>
              </div>
            </Link>

            <Link
              to={PREMIUM_ROUTES.AI_PLANNER}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-3 text-sm text-foreground bg-background border border-transparent rounded-xl hover:border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all shadow-sm group"
            >
              <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-lg text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-medium">Tạo lịch trình bằng AI</span>
                <span className="block text-xs text-muted-foreground mt-0.5">Lên kế hoạch tự động</span>
              </div>
            </Link>

            <button className="flex items-center gap-3 w-full px-3 py-3 text-sm text-foreground bg-background border border-transparent rounded-xl hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all shadow-sm group">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Map className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="block font-medium">Tối ưu lịch trình</span>
                <span className="block text-xs text-muted-foreground mt-0.5">Đề xuất tuyến đường tốt nhất</span>
              </div>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleToggle}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30"
        aria-label="Trợ lý ảo"
      >
        <Bot className="h-6 w-6" />
      </button>
    </div>
  );
}
