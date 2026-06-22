import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Edit2, Trash2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const STATUS_MAP = {
  DRAFT:     { label: "Bản nháp",        bg: "#6b7280" },
  PLANNED:   { label: "Đã lên kế hoạch", bg: "#3b82f6" },
  ONGOING:   { label: "Đang diễn ra",    bg: "#10b981" },
  COMPLETED: { label: "Đã hoàn thành",   bg: "#8b5cf6" },
  CANCELLED: { label: "Đã hủy",          bg: "#ef4444" },
};

const formatCurrency = (v) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v || 0);

const DEFAULT_THUMBNAIL =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80";

export default function TripCard({ trip, viewMode = "grid", onDelete }) {
  const navigate = useNavigate();
  const status = STATUS_MAP[trip.trangThai] || STATUS_MAP.DRAFT;

  const startDate = trip.ngayBatDau ? new Date(trip.ngayBatDau) : null;
  const endDate = trip.ngayKetThuc ? new Date(trip.ngayKetThuc) : null;
  const lastModified = trip.ngayCapNhat ? new Date(trip.ngayCapNhat) : null;
  const duration =
    startDate && endDate
      ? Math.max(1, differenceInDays(endDate, startDate) + 1)
      : 0;

  const thumbnail = trip.thumbnail || DEFAULT_THUMBNAIL;
  const formattedCost = trip.tongChiPhi
    ? formatCurrency(trip.tongChiPhi)
    : "Chưa tính";

  /* ── LIST VIEW ── */
  if (viewMode === "list") {
    return (
      <div className="trip-list-card">
        <div
          className="trip-list-card__thumb"
          onClick={() => navigate(`/trips/${trip.id}`)}
        >
          <img src={thumbnail} alt={trip.tenLichTrinh} />
          <span
            className="trip-status-badge"
            style={{ background: status.bg }}
          >
            {status.label}
          </span>
        </div>

        <div className="trip-list-card__body">
          <div className="trip-list-card__top">
            <div>
              <h3
                className="trip-list-card__name"
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                {trip.tenLichTrinh}
              </h3>
              <p className="trip-list-card__desc">
                {trip.moTa || "Chuyến du lịch tự túc"}
              </p>
            </div>
            <div className="trip-list-card__cost">
              <span>{formattedCost}</span>
              {lastModified && (
                <small>Cập nhật {format(lastModified, "dd/MM/yyyy")}</small>
              )}
            </div>
          </div>

          <div className="trip-list-card__meta">
            <span>
              <Calendar size={14} />
              {startDate ? format(startDate, "dd/MM/yyyy") : "Chưa có ngày"}
            </span>
            <span>
              <Clock size={14} />
              {duration} ngày
            </span>
            <span>
              <MapPin size={14} />
              {trip.soLuongDiaDiem || 0} điểm đến
            </span>
            <div className="trip-list-card__actions">
              <button
                className="trip-action-btn trip-action-btn--edit"
                onClick={() => navigate(`/trips/${trip.id}/planner`)}
                title="Chỉnh sửa"
              >
                <Edit2 size={14} />
              </button>
              <button
                className="trip-action-btn trip-action-btn--delete"
                onClick={() => onDelete(trip.id)}
                title="Xóa"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── GRID VIEW (travel photo overlay style) ── */
  return (
    <div
      className="trip-grid-card"
      onClick={() => navigate(`/trips/${trip.id}`)}
    >
      {/* Background Image */}
      <div className="trip-grid-card__img-wrap">
        <img
          src={thumbnail}
          alt={trip.tenLichTrinh}
          className="trip-grid-card__img"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="trip-grid-card__overlay" />

      {/* Status Badge */}
      <span
        className="trip-status-badge trip-status-badge--top-left"
        style={{ background: status.bg }}
      >
        {status.label}
      </span>

      {/* Actions (hover) */}
      <div
        className="trip-grid-card__actions"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="trip-action-btn trip-action-btn--edit"
          onClick={() => navigate(`/trips/${trip.id}/planner`)}
          title="Chỉnh sửa"
        >
          <Edit2 size={13} />
        </button>
        <button
          className="trip-action-btn trip-action-btn--delete"
          onClick={() => onDelete(trip.id)}
          title="Xóa"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Bottom Content */}
      <div className="trip-grid-card__content">
        <h3 className="trip-grid-card__name">{trip.tenLichTrinh}</h3>

        <div className="trip-grid-card__meta">
          <span>
            <Calendar size={12} />
            {startDate ? format(startDate, "dd/MM/yyyy") : "Chưa có ngày"}
          </span>
          <span>
            <Clock size={12} />
            {duration} ngày
          </span>
        </div>

        <div className="trip-grid-card__footer">
          <span>
            <MapPin size={12} />
            {trip.soLuongDiaDiem || 0} điểm đến
          </span>
          <span className="trip-grid-card__cost">{formattedCost}</span>
        </div>
      </div>
    </div>
  );
}
