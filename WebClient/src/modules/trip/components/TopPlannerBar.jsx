import {
  Archive,
  CheckCircle2,
  Cloud,
  CloudOff,
  Globe,
  Loader2,
  Lock,
  Unlock,
} from "lucide-react";

const statusConfig = {
  DRAFT: { Icon: Lock, label: "Bản nháp", className: "bg-slate-100 text-slate-700" },
  PRIVATE: { Icon: Lock, label: "Riêng tư", className: "bg-slate-800 text-white" },
  SHARED: { Icon: Unlock, label: "Đã chia sẻ", className: "bg-sky-100 text-sky-800" },
  PUBLIC: { Icon: Globe, label: "Công khai", className: "bg-emerald-100 text-emerald-800" },
  ARCHIVED: { Icon: Archive, label: "Lưu trữ", className: "bg-amber-100 text-amber-800" },
};

function SaveStatus({ saveStatus, lastUpdated }) {
  if (saveStatus === "SAVING") {
    return <><Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />Đang lưu...</>;
  }
  if (saveStatus === "SAVED") {
    return <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />Đã lưu {lastUpdated}</>;
  }
  if (saveStatus === "ERROR") {
    return <><CloudOff className="h-3.5 w-3.5 text-rose-600" />Lỗi lưu</>;
  }
  return <><Cloud className="h-3.5 w-3.5" />{lastUpdated}</>;
}

export default function TopPlannerBar({
  tripName,
  status,
  lastUpdated,
  saveStatus = "IDLE",
}) {
  const config = statusConfig[status] || statusConfig.DRAFT;
  const StatusIcon = config.Icon;

  return (
    <header className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2 shadow-sm sm:px-5">
      <div className="min-w-0">
        <h1 className="max-w-[210px] truncate text-base font-bold text-slate-950 sm:max-w-md sm:text-lg">
          {tripName}
        </h1>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 sm:hidden">
          <SaveStatus saveStatus={saveStatus} lastUpdated={lastUpdated} />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
          <SaveStatus saveStatus={saveStatus} lastUpdated={lastUpdated} />
        </div>
        <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${config.className}`}>
          <StatusIcon className="h-3 w-3" aria-hidden="true" />
          {config.label}
        </span>
      </div>
    </header>
  );
}
