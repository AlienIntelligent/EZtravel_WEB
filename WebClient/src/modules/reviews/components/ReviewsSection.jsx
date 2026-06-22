import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useSubmitServiceReviewMutation, useGetPlaceReviewsQuery, useGetServiceReviewsQuery } from "@/store/apis/communityApi";
import { useAppSelector } from "@/store/hooks";
import Swal from "sweetalert2";

export function ReviewsSection({ targetId, type = "place" }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = !!user;

  const placeReviewsQuery = useGetPlaceReviewsQuery(targetId, { skip: type !== "place" });
  const serviceReviewsQuery = useGetServiceReviewsQuery(targetId, { skip: type !== "service" });
  
  const reviews = type === "place" ? placeReviewsQuery.data || [] : serviceReviewsQuery.data || [];
  const isLoading = type === "place" ? placeReviewsQuery.isLoading : serviceReviewsQuery.isLoading;

  const [postReview, { isLoading: isPosting }] = useSubmitServiceReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      Swal.fire("Yêu cầu đăng nhập", "Bạn cần đăng nhập để viết đánh giá", "warning");
      return;
    }
    if (!content.trim()) {
      Swal.fire("Lỗi", "Vui lòng nhập nội dung đánh giá", "warning");
      return;
    }

    try {
      const payload = {
        rating,
        content,
      };
      if (type === "place") payload.placeId = targetId;
      else payload.serviceId = targetId;

      await postReview(payload).unwrap();
      setContent("");
      setRating(5);
      Swal.fire("Thành công", "Đánh giá của bạn đã được gửi", "success");
    } catch {
      Swal.fire("Lỗi", "Không thể gửi đánh giá. Vui lòng thử lại.", "error");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border shadow-sm">
      <h3 className="text-xl font-bold mb-6">Đánh giá ({reviews.length})</h3>

      {/* Write Review Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <h4 className="font-semibold mb-3">Viết đánh giá của bạn</h4>
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer transition-colors ${
                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            className="flex-1"
          />
          <Button type="submit" disabled={isPosting}>
            Gửi
          </Button>
        </div>
      </form>

      {/* Review List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-slate-500 py-4">Đang tải đánh giá...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-slate-500 py-4">Chưa có đánh giá nào. Hãy là người đầu tiên!</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{review.userName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{review.userName}</div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="ml-auto text-xs text-slate-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 pl-11">
                {review.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

