import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetTripsQuery, useDeleteTripMutation } from "@/store/apis/plannerApi";
import { Search, LayoutGrid, List, AlertCircle, Plus } from "lucide-react";
import "./trip.css";
import TripCard from "./components/TripCard";

const STATUS_FILTERS = [
  { label: "Tất cả", value: "ALL" },
  { label: "🗒️ Bản nháp", value: "DRAFT" },
  { label: "📋 Đã lên kế hoạch", value: "PLANNED" },
  { label: "✈️ Đang diễn ra", value: "ONGOING" },
  { label: "✅ Đã hoàn thành", value: "COMPLETED" },
  { label: "❌ Đã hủy", value: "CANCELLED" },
];

const HERO_BG = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80";

export default function TripsList() {
  const navigate = useNavigate();
  const { data: trips, isLoading, error, refetch } = useGetTripsQuery();
  const [deleteTrip] = useDeleteTripMutation();

  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  const filteredTrips = useMemo(() => {
    if (!trips) return [];
    let result = [...trips];
    if (searchQuery) {
      result = result.filter(t =>
        t.tenLichTrinh?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== "ALL") {
      result = result.filter(t => t.trangThai === statusFilter);
    }
    result.sort((a, b) => {
      if (sortBy === "NEWEST")
        return new Date(b.ngayCapNhat || 0) - new Date(a.ngayCapNhat || 0);
      if (sortBy === "OLDEST")
        return new Date(a.ngayCapNhat || 0) - new Date(b.ngayCapNhat || 0);
      if (sortBy === "START_DATE")
        return (
          new Date(a.ngayBatDau || 9999999999999) -
          new Date(b.ngayBatDau || 9999999999999)
        );
      return 0;
    });
    return result;
  }, [trips, searchQuery, statusFilter, sortBy]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chuyến đi này không?")) {
      try {
        await deleteTrip(id).unwrap();
        refetch();
      } catch {
        window.alert("Không thể xóa chuyến đi. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="trips-list-page">
      {/* ─── HERO BANNER ─── */}
      <div
        className="trips-hero"
        style={{ backgroundImage: `url("${HERO_BG}")` }}
      >
        <div className="trips-hero__overlay" />
        <div className="trips-hero__content">
          <p className="trips-hero__breadcrumb">
            <a href="/">Trang chủ</a>
            <span> / </span>
            <span>Chuyến đi của tôi</span>
          </p>
          <h1 className="trips-hero__title">Chuyến đi của tôi</h1>
          <p className="trips-hero__subtitle">
            Quản lý và lên kế hoạch cho các chuyến du lịch sắp tới của bạn
          </p>
          <button
            className="trips-hero__cta"
            onClick={() => navigate("/trips/create")}
          >
            <Plus size={18} />
            Tạo chuyến đi mới
          </button>
        </div>
      </div>

      {/* ─── CONTENT SECTION ─── */}
      <section className="trips-section">
        <div className="trips-container">

          {/* Toolbar */}
          <div className="trips-toolbar">
            {/* Status Filter Chips */}
            <div className="trips-toolbar__filters">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`trips-filter-chip ${
                    statusFilter === f.value ? "trips-filter-chip--active" : ""
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search + Sort + View Toggle */}
            <div className="trips-toolbar__controls">
              <div className="trips-search">
                <Search size={16} className="trips-search__icon" />
                <input
                  type="text"
                  aria-label="Tìm chuyến đi"
                  placeholder="Tìm chuyến đi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="trips-search__input"
                />
              </div>

              <select
                aria-label="Sắp xếp chuyến đi"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="trips-sort-select"
              >
                <option value="NEWEST">Mới nhất</option>
                <option value="OLDEST">Cũ nhất</option>
                <option value="START_DATE">Sắp khởi hành</option>
              </select>

              <div className="trips-view-toggle">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`trips-view-btn ${
                    viewMode === "grid" ? "trips-view-btn--active" : ""
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`trips-view-btn ${
                    viewMode === "list" ? "trips-view-btn--active" : ""
                  }`}
                  title="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div
              className={
                viewMode === "grid"
                  ? "trips-grid"
                  : "trips-list-view"
              }
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="trips-skeleton" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="trips-error">
              <AlertCircle size={48} />
              <p>Đã có lỗi xảy ra khi tải dữ liệu</p>
              <button onClick={() => refetch()}>Thử lại</button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredTrips.length === 0 && (
            <div className="trips-empty">
              <span className="trips-empty__icon">🎒</span>
              <h2 className="trips-empty__title">
                {searchQuery || statusFilter !== "ALL"
                  ? "Không tìm thấy chuyến đi"
                  : "Chưa có chuyến đi nào"}
              </h2>
              <p className="trips-empty__desc">
                {searchQuery || statusFilter !== "ALL"
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
                  : "Bắt đầu bằng cách tạo một lịch trình mới. Hãy để EZTravel giúp bạn lên kế hoạch chuyến đi tuyệt vời!"}
              </p>
              <button
                className="trips-empty__cta"
                onClick={() => navigate("/trips/create")}
              >
                Tạo Lịch Trình Ngay
              </button>
            </div>
          )}

          {/* Trips Grid / List */}
          {!isLoading && !error && filteredTrips.length > 0 && (
            <div
              className={
                viewMode === "grid"
                  ? "trips-grid"
                  : "trips-list-view"
              }
            >
              {filteredTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  viewMode={viewMode}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
