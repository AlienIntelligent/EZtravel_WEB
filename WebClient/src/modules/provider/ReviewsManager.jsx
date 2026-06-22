import { useState } from "react";
import { Loader2, MessageSquare, Star, ChevronDown, ChevronUp, RefreshCw, Send } from "lucide-react";
import {
  useGetProviderReviewsQuery,
  useReplyToReviewMutation,
} from "../../store/apis/providerApi";
import Pagination from "../../shared/components/Pagination";
import { useToast } from "@/components/ui/use-toast";

const formatDate = (value) => {
  if (!value) return "Chưa rõ";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Chưa rõ"
    : date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

function StarRating({ value }) {
  const stars = Math.round(Number(value ?? 0));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${stars} sao`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= stars ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}`}
          aria-hidden="true"
        />
      ))}
      <span className="ml-1.5 text-sm font-bold text-slate-800">{Number(value ?? 0).toFixed(1)}</span>
    </div>
  );
}

function ReplyForm({ reviewId, existingReply, onDone }) {
  const { toast } = useToast();
  const [content, setContent] = useState(existingReply ?? "");
  const [replyToReview, { isLoading }] = useReplyToReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    try {
      await replyToReview({ id: reviewId, body: { content: trimmed } }).unwrap();
      toast({ title: "Đã gửi phản hồi", description: "Phản hồi của bạn đã được lưu.", variant: "success" });
      onDone?.();
    } catch (err) {
      toast({
        title: "Không thể gửi phản hồi",
        description: err?.data?.message ?? "Vui lòng thử lại.",
        variant: "error",
      });
    }
  };

  return (
    <form className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3" onSubmit={handleSubmit}>
      <label className="text-xs font-semibold text-slate-600" htmlFor={`reply-${reviewId}`}>
        {existingReply ? "Chỉnh sửa phản hồi" : "Phản hồi khách hàng"}
      </label>
      <textarea
        id={`reply-${reviewId}`}
        className="min-h-20 w-full resize-y rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
        placeholder="Viết phản hồi chuyên nghiệp, lịch sự..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={1000}
        disabled={isLoading}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400">{content.length}/1000</span>
        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          Gửi phản hồi
        </button>
      </div>
    </form>
  );
}

function ReviewCard({ review }) {
  const [showReply, setShowReply] = useState(false);
  const hasReply = Boolean(review.providerReply || review.replyContent);
  const replyContent = review.providerReply ?? review.replyContent ?? "";

  return (
    <article className="space-y-1 rounded-md border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">
            {review.travelerName ?? review.userName ?? "Khách hàng"}
          </p>
          <StarRating value={review.rating} />
        </div>
        <time className="text-xs text-slate-400">{formatDate(review.createdAt)}</time>
      </div>

      {/* Service name tag */}
      {(review.serviceName ?? review.tenDichVu) && (
        <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
          {review.serviceName ?? review.tenDichVu}
        </span>
      )}

      {/* Review body */}
      <p className="text-sm leading-7 text-slate-700">
        {review.content ?? review.noiDung ?? "Khách hàng không để lại nội dung."}
      </p>

      {/* Images */}
      {review.images?.length ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {review.images.map((img, i) => (
            <img
              key={`${img}-${i}`}
              src={img}
              alt={`Ảnh đánh giá ${i + 1}`}
              className="h-14 w-14 rounded-md border object-cover"
            />
          ))}
        </div>
      ) : null}

      {/* Existing reply banner */}
      {hasReply && (
        <div className="rounded-md border-l-4 border-primary/40 bg-primary/5 px-4 py-2.5 text-sm text-slate-700">
          <p className="mb-1 text-xs font-bold text-primary">Phản hồi của bạn</p>
          {replyContent}
        </div>
      )}

      {/* Reply toggle */}
      <button
        type="button"
        onClick={() => setShowReply((v) => !v)}
        className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
      >
        <MessageSquare className="h-3.5 w-3.5" />
        {hasReply ? "Sửa phản hồi" : "Phản hồi"}
        {showReply ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {showReply && (
        <ReplyForm
          reviewId={review.id ?? review.maDanhGia}
          existingReply={replyContent}
          onDone={() => setShowReply(false)}
        />
      )}
    </article>
  );
}

function ReviewsManager() {
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const { data, isLoading, isError, refetch } = useGetProviderReviewsQuery();

  const allReviews = Array.isArray(data) ? data : data?.data ?? data?.items ?? [];
  const totalPages = Array.isArray(data) ? 1 : data?.totalPages ?? 1;

  const filtered = ratingFilter === "ALL"
    ? allReviews
    : allReviews.filter((r) => Math.round(Number(r.rating ?? 0)) === Number(ratingFilter));

  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((s, r) => s + Number(r.rating ?? 0), 0) / allReviews.length).toFixed(1)
    : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đánh giá khách hàng</h1>
          <p className="mt-1 text-sm text-slate-500">
            {allReviews.length} đánh giá · Trung bình{" "}
            <span className="font-semibold text-amber-600">{avgRating} ★</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
        >
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </button>
      </div>

      {/* Rating filter chips */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "5", "4", "3", "2", "1"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRatingFilter(r)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              ratingFilter === r
                ? "border-primary bg-primary text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-primary/40"
            }`}
          >
            {r === "ALL" ? "Tất cả" : `${r} ★`}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center" role="status">
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
          <span className="sr-only">Đang tải đánh giá</span>
        </div>
      ) : isError ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          Không thể tải đánh giá. Vui lòng thử lại.{" "}
          <button type="button" className="font-semibold underline" onClick={() => refetch()}>
            Thử lại
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-slate-50 text-sm text-slate-500">
          <Star className="h-8 w-8 text-slate-300" />
          <p className="font-semibold">
            {ratingFilter === "ALL" ? "Chưa có đánh giá nào" : `Không có đánh giá ${ratingFilter} sao`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <ReviewCard key={review.id ?? review.maDanhGia} review={review} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}

export default ReviewsManager;
