import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useGetTripByIdQuery } from "@/store/apis/plannerApi";
import {
  useCreateTripCommentMutation,
  useGetTripCommentsQuery,
  useCloneTripMutation,
} from "@/store/apis/communityApi";
import { useToast } from "@/components/ui/use-toast";
import { useAppSelector } from "@/store/hooks";
import Swal from "sweetalert2";
import { Edit3, Home, ChevronRight, Loader2, MessageCircle, RefreshCw, Send, Copy } from "lucide-react";
import { format } from "date-fns";
import "./trip.css";

/* ─── helpers ─── */
const fmtCurrency = (v) =>
 new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 maximumFractionDigits: 0,
 }).format(v || 0);

const fmtDate = (d) => (d ? format(new Date(d), "dd/MM/yyyy") : "—");

const STATUS_MAP = {
 DRAFT: { label: "Bản nháp", color: "#6b7280" },
 PLANNED: { label: "Đã lên kế hoạch", color: "#3b82f6" },
 ONGOING: { label: "Đang diễn ra", color: "#10b981" },
 COMPLETED: { label: "Đã hoàn thành", color: "#8b5cf6" },
 CANCELLED: { label: "Đã hủy", color: "#ef4444" },
};

function getItemBadge(item) {
 if (item.maKhachSan) return { label: "🏨 Khách sạn", cls: "badge-hotel" };
 if (item.maNhaHang) return { label: "🍜 Nhà hàng", cls: "badge-restaurant" };
 if (item.maHoatDong) return { label: "🎪 Hoạt động", cls: "badge-activity" };
 if (item.maPhuongTien)return { label: "🚗 Di chuyển", cls: "badge-transport" };
 return { label: "📍 Địa điểm", cls: "badge-place" };
}

/* ─── Map Embed (simple iframe fallback) ─── */
function SimpleMap() {
 return (
 <div className="td-map-wrap">
 <iframe
 title="Vietnam Map"
 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7842252.979893447!2d100.01481219999999!3d16.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31157a4d736a1e5f%3A0xb03bb5c9cdea188b!2sVietnam!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
 width="100%"
 height="100%"
 style={{ border: 0, borderRadius: "16px" }}
 allowFullScreen=""
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 />
 </div>
 );
}

/* ─── Left Sidebar ─── */
function TripSidePanel({ trip, navigate }) {
  const status = STATUS_MAP[trip.trangThai] || STATUS_MAP.DRAFT;
  const user = useAppSelector((state) => state.auth.user);
  const isOwner = user && (String(user.id) === String(trip.userId) || String(user.id) === String(trip.maNguoiDung));
  const [cloneTrip, { isLoading: isCloning }] = useCloneTripMutation();

  const handleClone = async () => {
    if (!user) {
      Swal.fire("Yêu cầu đăng nhập", "Bạn cần đăng nhập để sao chép lịch trình", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Sao chép lịch trình?",
      text: `Bạn có muốn sao chép lịch trình "${trip.tenLichTrinh}" về tài khoản của mình không?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy bỏ",
      confirmButtonColor: "#3b82f6",
    });

    if (!result.isConfirmed) return;

    try {
      const cloned = await cloneTrip(trip.id).unwrap();
      Swal.fire({
        title: "Thành công!",
        text: "Đã sao chép lịch trình thành công. Chuyển hướng đến bảng thiết kế...",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      const clonedId = cloned.id || cloned.maLichTrinh;
      navigate(`/trips/${clonedId}/planner`);
    } catch (err) {
      Swal.fire("Lỗi", err?.data?.message || "Không thể sao chép lịch trình này.", "error");
    }
  };

  const totalCost = trip.days?.reduce(
    (acc, d) =>
      acc + (d.items?.reduce((s, i) => s + (i.chiPhiDuKien || 0), 0) || 0),
    0
  ) || 0;

 return (
 <div className="td-sidebar">
 {/* Trip Info Card */}
 <div className="td-sidebar-card">
 <div className="td-sidebar-card__header">
 <h5>Chuyến đi của tôi</h5>
 <button
 className="td-btn-create"
 onClick={() => navigate("/trips/create")}
 >
 + Tạo mới
 </button>
 </div>

 <div className="td-trip-info">
 <div
 className="td-trip-info__strip"
 style={{ borderLeftColor: status.color }}
 >
 <h6 className="td-trip-info__name">{trip.tenLichTrinh}</h6>
 {trip.moTa && (
 <p className="td-trip-info__desc">{trip.moTa}</p>
 )}
 <div className="td-trip-info__meta">
 <span>📅 {fmtDate(trip.ngayBatDau)}</span>
 {trip.ngayKetThuc && <span> → {fmtDate(trip.ngayKetThuc)}</span>}
 </div>
 <div className="td-trip-info__meta">
 💰 Tổng:{" "}
 <strong style={{ color: "#e74c3c" }}>
 {fmtCurrency(totalCost || trip.tongChiPhi)}
 </strong>
          <div className="td-trip-info__actions">
            {isOwner ? (
              <button
                className="td-btn-action td-btn-action--edit"
                onClick={() => navigate(`/trips/${trip.id}/planner`)}
              >
                ✏️ Sửa kế hoạch
              </button>
            ) : (
              <button
                className="td-btn-action td-btn-action--clone"
                style={{ backgroundColor: '#10b981', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                onClick={handleClone}
                disabled={isCloning}
              >
                <Copy size={16} /> 
                {isCloning ? "Đang sao chép..." : "Sao chép lịch trình"}
              </button>
            )}
          </div>
        </div>
 </div>
 </div>
 </div>

 {/* Scratchpad Places (read from localStorage) */}
 <ScratchpadPanel />
 </div>
 );
}

/* ─── Scratchpad Panel ─── */
function ScratchpadPanel() {
 const [places] = useState(() => {
 try {
 return JSON.parse(localStorage.getItem("eztravel-selected-places")) || [];
 } catch {
 return [];
 }
 });

 return (
 <div className="td-sidebar-card mt-4">
 <h5 className="td-sidebar-card__title">Địa điểm đã chọn</h5>
 <p className="td-sidebar-card__hint">
 Các địa điểm bạn đã lưu từ trang khám phá:
 </p>
 {places.length === 0 ? (
 <div className="td-scratchpad-empty">
 Chưa có địa điểm nào được lưu. Hãy khám phá và lưu địa điểm để thêm
 vào kế hoạch!
 </div>
 ) : (
 <div className="td-scratchpad-list">
 {places.map((place, i) => (
 <div key={i} className="td-scratchpad-item">
 <div>
 <strong className="td-scratchpad-item__name">
 📍 {place.name}
 </strong>
 <div className="td-scratchpad-item__loc">{place.location}</div>
 <span className="td-scratchpad-item__price">
 {place.price ? fmtCurrency(place.price) : "Miễn phí"}
 </span>
 </div>
 <span className="td-scratchpad-item__type">{place.type}</span>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}

/* ─── Timeline Tab ─── */
function TimelineTab({ trip }) {
 if (!trip.days || trip.days.length === 0) {
 return (
 <div className="td-empty-state">
 <div className="td-empty-state__icon">🎒</div>
 <h4>Bắt đầu chuyến hành trình tự túc</h4>
 <p>
 Tạo một lịch trình mới hoặc chọn chuyến đi có sẵn từ danh sách để
 thiết kế dải thời gian chi tiết của bạn.
 </p>
 </div>
 );
 }

 return (
 <div className="td-timeline">
 {trip.days.map((day) => (
 <div key={day.maNgay} className="td-day-card">
 <div className="td-day-card__header">
 <div>
 <h4 className="td-day-card__title">Ngày {day.soThuTu}</h4>
 <small className="td-day-card__date">
 {day.ngay ? fmtDate(day.ngay) : "Chưa thiết lập ngày"}
 </small>
 </div>
 <span className="td-day-badge">
 {day.items?.length || 0} hoạt động
 </span>
 </div>

 <div className="td-day-card__body">
 {!day.items || day.items.length === 0 ? (
 <div className="td-day-empty">
 📥 Chưa có hoạt động nào cho ngày này
 </div>
 ) : (
 day.items.map((item) => {
 const badge = getItemBadge(item);
 return (
 <div key={item.id} className="td-timeline-item">
 <div className="td-timeline-item__time">
 ⏰ {item.startTime?.substring(0, 5) || "08:00"}
 </div>
 <div className="td-timeline-item__info">
 <strong className="td-timeline-item__title">
 {item.tieuDe}
 </strong>
 {item.tenDiaDiem && (
 <p className="td-timeline-item__loc">
 📍 {item.tenDiaDiem}
 </p>
 )}
 {item.ghiChu && (
 <p className="td-timeline-item__note">{item.ghiChu}</p>
 )}
 </div>
 <div className="td-timeline-item__right">
 <span className={`td-item-badge ${badge.cls}`}>
 {badge.label}
 </span>
 {item.chiPhiDuKien > 0 && (
 <span className="td-timeline-item__cost">
 {fmtCurrency(item.chiPhiDuKien)}
 </span>
 )}
 </div>
 </div>
 );
 })
 )}
 </div>
 </div>
 ))}
 </div>
 );
}

/* ─── Budget Tab ─── */
function BudgetTab({ trip }) {
 const costBreakdown = {
 "🏨 Khách sạn": 0,
 "🍜 Nhà hàng": 0,
 "🎪 Hoạt động": 0,
 "🚗 Di chuyển": 0,
 "📍 Địa điểm / Khác": 0,
 };
 let total = 0;

 trip.days?.forEach((day) => {
 day.items?.forEach((item) => {
 const c = item.chiPhiDuKien || 0;
 total += c;
 if (item.maKhachSan) costBreakdown["🏨 Khách sạn"] += c;
 else if (item.maNhaHang) costBreakdown["🍜 Nhà hàng"] += c;
 else if (item.maHoatDong) costBreakdown["🎪 Hoạt động"] += c;
 else if (item.maPhuongTien) costBreakdown["🚗 Di chuyển"] += c;
 else costBreakdown["📍 Địa điểm / Khác"] += c;
 });
 });

 const allItems = trip.days?.flatMap((d) => d.items || []) || [];

 return (
 <div className="td-budget">
 <div className="td-budget-header">
 <h4>Quản lý chi phí chi tiết</h4>
 <p>Danh sách ước lượng các chi phí theo từng hoạt động.</p>
 </div>

 {/* Summary cards */}
 <div className="td-budget-summary">
 {Object.entries(costBreakdown).map(([cat, val]) => (
 <div key={cat} className="td-budget-cat">
 <span className="td-budget-cat__name">{cat}</span>
 <span className="td-budget-cat__val">{fmtCurrency(val)}</span>
 </div>
 ))}
 </div>

 {/* Detail table */}
 <div className="td-budget-table-wrap">
 <table className="td-budget-table">
 <thead>
 <tr>
 <th>Hoạt động</th>
 <th>Loại</th>
 <th className="text-right">Chi phí dự kiến</th>
 </tr>
 </thead>
 <tbody>
 {allItems.length === 0 ? (
 <tr>
 <td colSpan={3} className="td-budget-empty">
 Chưa có chi phí nào. Thêm hoạt động vào timeline để hệ thống
 tự động tổng hợp.
 </td>
 </tr>
 ) : (
 <>
 {allItems.map((item) => {
 const badge = getItemBadge(item);
 return (
 <tr key={item.id}>
 <td>{item.tieuDe}</td>
 <td>
 <span className={`td-item-badge ${badge.cls}`}>
 {badge.label}
 </span>
 </td>
 <td className="text-right td-budget-cost">
 {fmtCurrency(item.chiPhiDuKien)}
 </td>
 </tr>
 );
 })}
 <tr className="td-budget-total-row">
 <td colSpan={2}>Tổng cộng dự kiến:</td>
 <td className="text-right">{fmtCurrency(total)}</td>
 </tr>
 </>
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
}

function TripComments({ tripId }) {
 const { toast } = useToast();
 const {
 data: comments = [],
 isLoading,
 isError,
 refetch,
 } = useGetTripCommentsQuery(tripId);
 const [createComment, { isLoading: isPosting }] = useCreateTripCommentMutation();
 const [content, setContent] = useState("");
 const [formError, setFormError] = useState("");

 const handleSubmit = async (event) => {
 event.preventDefault();
 const value = content.trim();
 if (!value) {
 setFormError("Vui lòng nhập nội dung bình luận.");
 return;
 }
 if (value.length > 1000) {
 setFormError("Bình luận không được vượt quá 1000 ký tự.");
 return;
 }

 try {
 await createComment({ tripId, content: value }).unwrap();
 setContent("");
 setFormError("");
 toast({
 title: "Đã đăng bình luận",
 description: "Bình luận của bạn đã được lưu.",
 variant: "success",
 });
 } catch (error) {
 setFormError(error?.data?.message ?? "Không thể đăng bình luận.");
 }
 };

 return (
 <section className="td-comments" aria-labelledby="trip-comments-title">
 <div className="td-comments__heading">
 <div>
 <h2 id="trip-comments-title">Thảo luận chuyến đi</h2>
 <p>{comments.length} bình luận</p>
 </div>
 <MessageCircle size={22} aria-hidden="true" />
 </div>

 <form className="td-comment-form" onSubmit={handleSubmit}>
 <label htmlFor="trip-comment-content" className="sr-only">Viết bình luận</label>
 <textarea
 id="trip-comment-content"
 value={content}
 onChange={(event) => {
 setContent(event.target.value);
 if (formError) setFormError("");
 }}
 placeholder="Chia sế góc nhìn của bạn về chuyến đi"
 maxLength={1000}
 rows={3}
 aria-describedby={formError ? "trip-comment-error" : undefined}
 />
 <div className="td-comment-form__footer">
 <span>{content.length}/1000</span>
 <button type="submit" disabled={isPosting}>
 {isPosting ? (
 <Loader2 size={16} className="animate-spin" aria-hidden="true" />
 ) : (
 <Send size={16} aria-hidden="true" />
 )}
 Đăng
 </button>
 </div>
 {formError && <p id="trip-comment-error" className="td-comment-form__error" role="alert">{formError}</p>}
 </form>

 {isLoading ? (
 <div className="td-comments__state" role="status">
 <Loader2 size={20} className="animate-spin" aria-hidden="true" />
 Đang tải bình luận
 </div>
 ) : isError ? (
 <div className="td-comments__state td-comments__state--error" role="alert">
 <span>Không thể tải bình luận.</span>
 <button type="button" onClick={refetch}>
 <RefreshCw size={15} aria-hidden="true" />
 Thử lại
 </button>
 </div>
 ) : comments.length === 0 ? (
 <div className="td-comments__state">Chưa có bình luận. Hãy bắt đầu cuộc trò chuyện.</div>
 ) : (
 <div className="td-comment-list">
 {comments.map((comment) => (
 <article key={comment.id} className="td-comment">
 {comment.authorAvatar ? (
 <img src={comment.authorAvatar} alt={comment.authorName} className="td-comment__avatar" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 ) : (
 <div className="td-comment__avatar td-comment__avatar--fallback" aria-hidden="true">
 {(comment.authorName || "T").trim().charAt(0).toUpperCase()}
 </div>
 )}
 <div className="td-comment__body">
 <div className="td-comment__meta">
 <strong>{comment.authorName}</strong>
 {comment.isOwn && <span>Của bạn</span>}
 <time dateTime={comment.createdAt}>
 {new Date(comment.createdAt).toLocaleString("vi-VN")}
 </time>
 </div>
 <p>{comment.content}</p>
 </div>
 </article>
 ))}
 </div>
 )}
 </section>
 );
}

/* ─── Main Component ─── */
export default function TripDetails() {
 const { id } = useParams();
 const navigate = useNavigate();
 const { data: trip, isLoading } = useGetTripByIdQuery(Number(id));
 const [activeTab, setActiveTab] = useState("timeline");

 /* Loading skeleton */
 if (isLoading) {
 return (
 <div className="td-loading">
 <div className="td-loading__hero" />
 <div className="td-loading__body">
 <div className="td-loading__col" />
 <div className="td-loading__col" />
 <div className="td-loading__col--sm" />
 </div>
 </div>
 );
 }

 if (!trip) {
 return (
 <div className="td-not-found">
 <span>😕</span>
 <h2>Không tìm thấy chuyến đi</h2>
 <Link to="/trips">← Quay lại danh sách</Link>
 </div>
 );
 }

 const status = STATUS_MAP[trip.trangThai] || STATUS_MAP.DRAFT;
 const heroBg =
 trip.thumbnail ||
 "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80";

 return (
 <div className="td-page">
 {/* ─── HERO BANNER ─── */}
 <div
 className="td-hero"
 style={{ backgroundImage: `url("${heroBg}")` }}
 >
 <div className="td-hero__overlay" />
 <div className="td-hero__content text-white">
 <nav className="td-breadcrumb text-slate-100">
 <Link to="/" aria-label="Về trang chủ" className="text-white hover:text-white">
 <Home size={14} aria-hidden="true" />
 </Link>
 <ChevronRight size={14} />
 <Link to="/trips" className="text-white hover:text-white">Lộ trình của tôi</Link>
 <ChevronRight size={14} />
 <span>{trip.tenLichTrinh}</span>
 </nav>
 <h1 className="td-hero__title text-white">{trip.tenLichTrinh}</h1>
 <div className="td-hero__meta">
 <span className="td-hero__status" style={{ background: status.color }}>
 {status.label}
 </span>
 {trip.ngayBatDau && (
 <span>📅 {fmtDate(trip.ngayBatDau)} – {fmtDate(trip.ngayKetThuc)}</span>
 )}
 {trip.days?.length > 0 && (
 <span>📆 {trip.days.length} ngày</span>
 )}
 </div>
 </div>
 </div>

 {/* ─── 3-COLUMN PLANNER ─── */}
 <section className="td-workspace">
 <div className="td-workspace__inner">

 {/* LEFT: Trip info sidebar */}
 <aside className="td-workspace__left">
 <TripSidePanel trip={trip} navigate={navigate} />
 </aside>

 {/* CENTER: Timeline / Budget */}
 <main className="td-workspace__center">
 {/* Tab Toggle Buttons */}
 <div className="td-tab-bar">
 <button
 className={`td-tab-btn ${activeTab === "timeline" ? "td-tab-btn--active" : ""}`}
 onClick={() => setActiveTab("timeline")}
 >
 ⏱️ Dòng thời gian (Timeline)
 </button>
 <button
 className={`td-tab-btn ${activeTab === "budget" ? "td-tab-btn--active" : ""}`}
 onClick={() => setActiveTab("budget")}
 >
 📊 Bảng chi phí (Budget)
 </button>
 <button
 className="td-tab-btn td-tab-btn--planner"
 onClick={() => navigate(`/trips/${trip.id}/planner`)}
 title="Mở trình lập kế hoạch"
 >
 <Edit3 size={15} />
 Lập kế hoạch
 </button>
 </div>

 {activeTab === "timeline" && <TimelineTab trip={trip} />}
 {activeTab === "budget" && <BudgetTab trip={trip} />}
 <TripComments tripId={Number(id)} />
 </main>

 {/* RIGHT: Map */}
 <aside className="td-workspace__right">
 <div className="td-map-card">
 <SimpleMap />
 </div>
 </aside>
 </div>
 </section>
 </div>
 );
}
