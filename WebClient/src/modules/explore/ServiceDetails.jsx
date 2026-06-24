import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
 ArrowLeft,
 Building2,
 CalendarDays,
 Eye,
 ImageIcon,
 Loader2,
 MapPin,
 Send,
 Star,
 UserRound,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAppSelector } from "@/store/hooks";
import {
 useGetServiceDetailsQuery,
 useGetServiceReviewsQuery,
 useSubmitServiceReviewMutation,
} from "../../store/apis/exploreApi";

const serviceTypeLabels = {
 ACCOMMODATION: "Luu tru",
 FOOD: "Am thuc",
 ACTIVITY: "Hoat dong",
 TRANSPORT: "Di chuyen",
 KHACH_SAN: "Luu tru",
 NHA_HANG: "Am thuc",
 HOAT_DONG: "Hoat dong",
 PHUONG_TIEN: "Di chuyen",
};

const formatPrice = (value) => {
 const amount = Number(value ?? 0);
 return amount > 0 ? new Intl.NumberFormat("vi-VN").format(amount) + " d" : "Lien he";
};

const formatDate = (value) => {
 if (!value) return "";
 const date = new Date(value);
 if (Number.isNaN(date.getTime())) return "";
 return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(date);
};

const getServiceName = (service) => service?.name ?? service?.tenDichVu ?? "Dịch vụ";
const getDescription = (service) => service?.description ?? service?.moTa ?? "";
const getReviewContent = (review) => review?.content ?? review?.comment ?? review?.noiDung ?? "";

export default function ServiceDetails() {
 const { id } = useParams();
 const serviceId = Number(id);
 const invalidId = !Number.isFinite(serviceId) || serviceId <= 0;
 const { toast } = useToast();
 const user = useAppSelector((state) => state.auth.user);
 const [selectedImageIndex, setSelectedImageIndex] = useState(0);
 const [rating, setRating] = useState(5);
 const [comment, setComment] = useState("");
 const [imageUrl, setImageUrl] = useState("");
 const [formError, setFormError] = useState("");

 const {
 data: service,
 isLoading,
 isError,
 refetch,
 } = useGetServiceDetailsQuery(serviceId, { skip: invalidId });
 const {
 data: reviewData = [],
 isLoading: isLoadingReviews,
 isError: isReviewsError,
 refetch: refetchReviews,
 } = useGetServiceReviewsQuery(serviceId, { skip: invalidId });
 const [submitReview, { isLoading: isSubmitting }] = useSubmitServiceReviewMutation();

 const reviews = Array.isArray(reviewData)
 ? reviewData
 : reviewData?.items ?? reviewData?.data ?? [];

 const handleSubmitReview = async (event) => {
 event.preventDefault();
 const content = comment.trim();
 if (!content) {
 setFormError("Noi dung danh gia la bat buoc.");
 return;
 }

 try {
 await submitReview({
 id: serviceId,
 body: {
 rating,
 comment: content,
 imageUrl: imageUrl.trim(),
 },
 }).unwrap();

 setComment("");
 setImageUrl("");
 setRating(5);
 setFormError("");
 toast({
 title: "Đã gửi đánh giá",
 description: "Đánh giá của bạn đã được lưu vào dịch vụ.",
 variant: "success",
 });
 } catch (err) {
 const message = err?.data?.error ?? err?.data?.message ?? "Khong the gui danh gia. Vui long thu lai.";
 setFormError(message);
 toast({ title: "Khong the gui danh gia", description: message, variant: "error" });
 }
 };

 if (isLoading) {
 return (
 <div className="container mx-auto max-w-6xl px-4 py-8">
 <div className="h-80 animate-pulse rounded-md bg-muted/50" />
 <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
 <div className="h-48 animate-pulse rounded-md bg-muted/30" />
 <div className="h-48 animate-pulse rounded-md bg-muted/30" />
 </div>
 </div>
 );
 }

 if (invalidId || isError || !service) {
 return (
 <div className="container mx-auto max-w-6xl px-4 py-8">
 <Link
 to="/explore"
 className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
 >
 <ArrowLeft className="h-4 w-4" />
 Quay lại khám phá
 </Link>
 <div className="rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-700">
 Không thể tải dịch vụ này.{" "}
 {!invalidId && (
 <button className="font-semibold underline" type="button" onClick={() => refetch()}>
 Thu lai
 </button>
 )}
 </div>
 </div>
 );
 }

 const images = Array.from(new Set([...(service.images ?? []), service.thumbnail].filter(Boolean)));
 const selectedImage = images[selectedImageIndex] ?? images[0];
 const placeId = service.placeId ?? service.maDiaDiem ?? service.place?.id;
 const provider = service.provider ?? {};
 const averageRating = Number(service.averageRating ?? service.ratingAvg ?? 0);
 const reviewCount = service.totalReviews ?? service.totalReview ?? reviews.length;
 const serviceType = service.type ?? service.loaiDichVu;

 return (
 <div className="container mx-auto max-w-6xl px-4 py-8 pb-14">
 <Link
 to={placeId ? `/explore/destinations/${placeId}` : "/explore"}
 className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
 >
 <ArrowLeft className="h-4 w-4" />
 {placeId ? "Quay lại địa điểm" : "Quay lại khám phá"}
 </Link>

 <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
 <div className="overflow-hidden rounded-md border bg-muted">
 {selectedImage ? (
 <img src={selectedImage} alt={getServiceName(service)} className="h-72 w-full object-cover sm:h-96" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 ) : (
 <div className="flex h-72 items-center justify-center text-muted-foreground sm:h-96">
 <ImageIcon className="h-10 w-10" />
 </div>
 )}
 </div>

 {images.length > 1 && (
 <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
 {images.slice(0, 4).map((image, index) => (
 <button
 key={image}
 type="button"
 className={`overflow-hidden rounded-md border-2 ${
 selectedImageIndex === index ? "border-primary" : "border-transparent"
 }`}
 onClick={() => setSelectedImageIndex(index)}
 aria-label={`Xem anh ${index + 1}`}
 >
 <img src={image} alt="" className="h-20 w-full object-cover lg:h-[90px]" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 </button>
 ))}
 </div>
 )}
 </div>

 <div className="grid gap-8 py-8 lg:grid-cols-[1fr_310px]">
 <main>
 <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
 <span className="rounded border bg-muted/40 px-2.5 py-1 text-xs font-semibold text-foreground">
 {serviceTypeLabels[serviceType] ?? serviceType ?? "Dịch vụ"}
 </span>
 <span className="inline-flex items-center gap-1.5">
 <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
 {averageRating.toFixed(1)} ({reviewCount})
 </span>
 <span className="inline-flex items-center gap-1.5">
 <Eye className="h-4 w-4" />
 {service.luotXem ?? service.viewCount ?? 0} luot xem
 </span>
 </div>

 <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
 {getServiceName(service)}
 </h1>
 <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground">
 <MapPin className="h-4 w-4 text-primary" />
 {service.address ?? service.diaChi ?? service.place?.address ?? service.placeName ?? "Chua cap nhat dia chi"}
 </p>

 <div className="mt-7 border-t pt-6">
 <h2 className="text-xl font-bold text-foreground">Mô tả dịch vụ</h2>
 <p className="mt-3 whitespace-pre-line text-base leading-8 text-muted-foreground">
 {getDescription(service) || "Thong tin chi tiet dang duoc cap nhat."}
 </p>
 </div>
 </main>

 <aside className="h-fit rounded-md border bg-background p-5 shadow-sm">
 <p className="text-xs font-semibold uppercase text-muted-foreground">Gia tham khao</p>
 <p className="mt-2 text-2xl font-bold text-primary">{formatPrice(service.price ?? service.giaTu)}</p>
 {service.referencePrice && service.referencePrice !== service.price && (
 <p className="mt-1 text-xs text-muted-foreground">Den {formatPrice(service.referencePrice)}</p>
 )}

 <div className="mt-5 border-t pt-5">
 <div className="flex items-start gap-3">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
 {provider.logo ? (
 <img src={provider.logo} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 ) : (
 <Building2 className="h-5 w-5 text-muted-foreground" />
 )}
 </div>
 <div>
 <p className="text-xs text-muted-foreground">Nha cung cap</p>
 <p className="mt-1 text-sm font-bold text-foreground">
 {service.providerName ?? provider.name ?? "Nha cung cap ezTravel"}
 </p>
 </div>
 </div>
 </div>

 {placeId && (
 <Link
 to={`/explore/destinations/${placeId}`}
 className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
 >
 <MapPin className="h-4 w-4" />
 Xem địa điểm
 </Link>
 )}
 </aside>
 </div>

 <section className="border-t pt-8">
 <div className="flex flex-wrap items-end justify-between gap-3">
 <div>
 <h2 className="text-2xl font-bold text-foreground">Đánh giá dịch vụ</h2>
 <p className="mt-1 text-sm text-muted-foreground">{reviews.length} danh gia tu nguoi dung.</p>
 </div>
 <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
 <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
 {averageRating.toFixed(1)} / 5
 </div>
 </div>

 <div className="mt-6 grid gap-8 lg:grid-cols-[340px_1fr]">
 <div>
 {user ? (
 <form className="rounded-md border bg-background p-5" onSubmit={handleSubmitReview}>
 <h3 className="font-bold text-foreground">Viet danh gia</h3>
 <div className="mt-4 flex gap-1" aria-label="Chon so sao">
 {[1, 2, 3, 4, 5].map((star) => (
 <button
 key={star}
 type="button"
 className="rounded p-0.5 focus:outline-none focus:ring-2 focus:ring-primary"
 onClick={() => setRating(star)}
 aria-label={`${star} sao`}
 >
 <Star
 className={`h-6 w-6 ${
 star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
 }`}
 />
 </button>
 ))}
 </div>

 <textarea
 className="mt-4 min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
 placeholder="Chia se trai nghiem cua ban..."
 value={comment}
 onChange={(event) => {
 setComment(event.target.value);
 if (formError) setFormError("");
 }}
 disabled={isSubmitting}
 maxLength={2000}
 required
 />
 <input
 className="mt-3 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary"
 placeholder="Link anh (tuy chon)"
 value={imageUrl}
 onChange={(event) => setImageUrl(event.target.value)}
 disabled={isSubmitting}
 type="url"
 />
 {formError && <p className="mt-3 text-sm text-red-600">{formError}</p>}
 <button
 type="submit"
 className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
 disabled={!comment.trim() || isSubmitting}
 >
 {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
 Gui danh gia
 </button>
 </form>
 ) : (
 <div className="rounded-md border bg-background p-5 text-sm text-muted-foreground">
 <UserRound className="mb-3 h-6 w-6 text-primary" />
 <p>Bạn cần đăng nhập để gửi đánh giá.</p>
 <Link className="mt-4 inline-flex font-semibold text-primary hover:underline" to="/auth/login">
 Dang nhap
 </Link>
 </div>
 )}
 </div>

 <div className="space-y-4">
 {isLoadingReviews ? (
 [0, 1, 2].map((item) => (
 <div key={item} className="h-28 animate-pulse rounded-md border bg-muted/40" />
 ))
 ) : isReviewsError ? (
 <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
 Khong the tai danh gia.{" "}
 <button className="font-semibold underline" type="button" onClick={() => refetchReviews()}>
 Thu lai
 </button>
 </div>
 ) : reviews.length === 0 ? (
 <div className="rounded-md border bg-background px-4 py-10 text-center text-sm text-muted-foreground">
 Chưa có đánh giá nào cho dịch vụ này.
 </div>
 ) : (
 reviews.map((review) => {
 const reviewRating = review.rating ?? review.soSao ?? 0;
 return (
 <article key={review.id ?? review.maDanhGia} className="rounded-md border bg-background p-5">
 <div className="flex flex-wrap items-start justify-between gap-3">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-bold text-foreground">
 {review.avatar ? (
 <img src={review.avatar} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 ) : (
 (review.userName ?? "U").charAt(0).toUpperCase()
 )}
 </div>
 <div>
 <p className="text-sm font-bold text-foreground">{review.userName ?? "Traveler"}</p>
 <div className="mt-1 flex gap-0.5">
 {[1, 2, 3, 4, 5].map((star) => (
 <Star
 key={star}
 className={`h-3.5 w-3.5 ${
 star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
 }`}
 />
 ))}
 </div>
 </div>
 </div>
 <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
 <CalendarDays className="h-3.5 w-3.5" />
 {formatDate(review.createdAt ?? review.ngayTao)}
 </span>
 </div>
 <p className="mt-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">
 {getReviewContent(review)}
 </p>
 {review.images?.[0] && (
 <img src={review.images[0]} alt="Anh danh gia" className="mt-4 h-32 rounded-md object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 )}
 {review.reply && (
 <div className="mt-4 border-l-2 border-primary bg-muted/40 px-4 py-3 text-sm">
 <p className="font-semibold text-foreground">Phan hoi tu nha cung cap</p>
 <p className="mt-1 text-muted-foreground">{review.reply}</p>
 </div>
 )}
 </article>
 );
 })
 )}
 </div>
 </div>
 </section>
 </div>
 );
}
