import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
 ArrowRight,
 CalendarDays,
 Compass,
 Copy,
 Eye,
 Heart,
 Map,
 MapPin,
 MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ExploreCard } from "@/features/explore";
import {
 useGetTrendingDestinationsQuery,
 useGetTrendingTripsQuery,
} from "@/store/apis/exploreApi";
import {
 useGetBlogsQuery,
} from "@/store/apis/communityApi";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/router/routes";

const FALLBACK_TRIP_IMAGES = [
 "/images/destination-1.jpg",
 "/images/destination-2.jpg",
 "/images/destination-3.jpg",
 "/images/destination-4.jpg",
];

const asList = (data) => {
 if (Array.isArray(data)) return data;
 if (Array.isArray(data?.items)) return data.items;
 if (Array.isArray(data?.data)) return data.data;
 return [];
};

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(Number(value) || 0);

const formatDate = (value) => {
 if (!value) return "Chưa cập nhật";
 const date = new Date(value);
 if (Number.isNaN(date.getTime())) return "Chưa cập nhật";
 return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
};

const formatDateRange = (startDate, endDate) => {
 if (!startDate && !endDate) return "Lịch trình linh hoạt";
 if (!endDate || startDate === endDate) return formatDate(startDate || endDate);
 return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

function SectionHeading({ title, description, to, actionLabel }) {
 return (
 <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
 <div>
 <h2 className="font-sans text-2xl font-bold text-foreground sm:text-3xl">
 {title}
 </h2>
 <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground ">
 {description}
 </p>
 </div>
 <Button asChild variant="ghost" className="w-fit gap-2 px-0 text-primary hover:bg-transparent">
 <Link to={to}>
 {actionLabel}
 <ArrowRight className="h-4 w-4" aria-hidden="true" />
 </Link>
 </Button>
 </div>
 );
}

function LoadingGrid({ count = 3, image = true }) {
 return (
 <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
 {Array.from({ length: count }, (_, index) => (
 <div key={index} className="overflow-hidden rounded-md border bg-background">
 {image && <Skeleton className="h-44 w-full rounded-none" />}
 <div className="space-y-3 p-4">
 <Skeleton className="h-5 w-3/4" />
 <Skeleton className="h-4 w-full" />
 <Skeleton className="h-4 w-2/3" />
 </div>
 </div>
 ))}
 </div>
 );
}

function SectionError({ message, onRetry }) {
 return (
 <div className="flex flex-col items-start gap-3 rounded-md border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
 <p>{message}</p>
 <Button type="button" variant="outline" size="sm" onClick={onRetry}>
 Thử lại
 </Button>
 </div>
 );
}

function TripCard({ trip, index }) {
 const id = trip.id ?? trip.tripId;
 const title = trip.title ?? trip.tripName ?? trip.name ?? "Lịch trình cộng đồng";
 const description = trip.description ?? trip.content ?? "";
 const image = trip.thumbnail ?? trip.coverImage ?? FALLBACK_TRIP_IMAGES[index % FALLBACK_TRIP_IMAGES.length];

 return (
 <Link
 to={PUBLIC_ROUTES.COMMUNITY}
 className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md "
 aria-label={`Xem lịch trình ${title} trong cộng đồng`}
 state={{ tripId: id }}
 >
 <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted ">
 <img src={image}
 alt={title}
 className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 <div className="absolute bottom-3 left-3 rounded bg-slate-950/75 px-2 py-1 text-xs font-medium text-white">
 {trip.authorName ?? trip.userName ?? "Traveler"}
 </div>
 </div>
 <div className="flex flex-1 flex-col p-4">
 <h3 className="line-clamp-2 font-sans text-lg font-bold text-foreground group-hover:text-primary ">
 {title}
 </h3>
 <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground ">
 {description || "Một hành trình công khai được cộng đồng ezTravel chia sẻ."}
 </p>
 <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground ">
 <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
 <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
 </div>
 <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground ">
 <span className="inline-flex items-center gap-1">
 <Heart className="h-3.5 w-3.5" aria-hidden="true" />
 {formatNumber(trip.likeCount ?? trip.likes)}
 </span>
 <span className="inline-flex items-center gap-1">
 <Copy className="h-3.5 w-3.5" aria-hidden="true" />
 {formatNumber(trip.cloneCount)}
 </span>
 <span className="inline-flex items-center gap-1">
 <Eye className="h-3.5 w-3.5" aria-hidden="true" />
 {formatNumber(trip.viewCount)}
 </span>
 </div>
 </div>
 </Link>
 );
}

function BlogCard({ blog }) {
 const id = blog.id ?? blog.maBaiViet;
 const title = blog.title ?? blog.tieuDe ?? "Bài viết du lịch";
 const summary = blog.summary ?? blog.tomTat ?? blog.content ?? blog.noiDung ?? "";
 const image = blog.thumbnail ?? blog.images?.[0];

 return (
 <Link
 to={PUBLIC_ROUTES.BLOG_DETAILS.replace(":id", id)}
 className="group grid overflow-hidden rounded-md border border-border bg-background shadow-sm transition hover:shadow-md sm:grid-cols-[12rem_1fr]"
 >
 {image ? (
 <img src={image} alt={title} className="aspect-video w-full object-cover sm:h-full sm:aspect-auto" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 ) : (
 <div className="flex aspect-video w-full items-center justify-center bg-muted text-muted-foreground sm:h-full sm:aspect-auto">
 <Map className="h-8 w-8" aria-hidden="true" />
 </div>
 )}
 <div className="flex min-w-0 flex-col p-4">
 <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground ">
 <span>{blog.authorName ?? blog.userName ?? "Traveler"}</span>
 <span>{formatDate(blog.createdAt ?? blog.ngayTao)}</span>
 </div>
 <h3 className="mt-2 line-clamp-2 font-sans text-lg font-bold text-foreground group-hover:text-primary ">
 {title}
 </h3>
 <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-muted-foreground ">
 {summary}
 </p>
 <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground ">
 <span className="inline-flex items-center gap-1">
 <Eye className="h-3.5 w-3.5" aria-hidden="true" />
 {formatNumber(blog.viewCount ?? blog.luotXem)}
 </span>
 <span className="inline-flex items-center gap-1">
 <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
 {formatNumber(blog.commentCount)}
 </span>
 {blog.placeName && (
 <span className="inline-flex min-w-0 items-center gap-1">
 <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
 <span className="truncate">{blog.placeName}</span>
 </span>
 )}
 </div>
 </div>
 </Link>
 );
}

export default function Home() {
 const navigate = useNavigate();
 const [searchQuery, setSearchQuery] = useState("");
 const destinationsQuery = useGetTrendingDestinationsQuery();
 const tripsQuery = useGetTrendingTripsQuery();
 const blogsQuery = useGetBlogsQuery();

 const destinations = asList(destinationsQuery.data).slice(0, 6);
 const trips = asList(tripsQuery.data).slice(0, 4);
 const blogs = asList(blogsQuery.data).slice(0, 4);

 const handleSearchSubmit = (event) => {
 event.preventDefault();
 const keyword = searchQuery.trim();
 navigate(keyword ? `${PUBLIC_ROUTES.EXPLORE}?keyword=${encodeURIComponent(keyword)}` : PUBLIC_ROUTES.EXPLORE);
 };

 return (
 <div className="w-full bg-background dark:bg-slate-950">
 <section className="relative flex min-h-[72svh] items-center overflow-hidden bg-slate-950 py-14 text-white">
 <div
 className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45"
 style={{ backgroundImage: 'url("/images/bg_1.jpg")' }}
 />
 <div className="absolute inset-0 bg-slate-950/60" />
 <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center md:px-8">
 <h1 className="font-sans text-4xl font-bold leading-tight text-white drop-shadow-md sm:text-5xl md:text-6xl">Khám Phá Việt Nam Cùng ezTravel</h1>
 <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-100 md:text-lg drop-shadow">
 Khám phá điểm đến tuyệt đẹp, tham khảo lịch trình chân thực và bắt đầu chuyến đi trong mơ của bạn.
 </p>

 <form
 onSubmit={handleSearchSubmit}
 className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-md border border-white/25 bg-slate-950/55 p-2 shadow-xl backdrop-blur-sm sm:flex-row"
 >
 <label htmlFor="home-search" className="sr-only">Tìm điểm đến</label>
 <input
 id="home-search"
 type="search"
 placeholder="Bạn muốn đi đâu?"
 value={searchQuery}
 onChange={(event) => setSearchQuery(event.target.value)}
 className="min-h-11 flex-1 rounded-md border-0 bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
 />
 <Button type="submit" size="lg" className="gap-2">
 <Compass className="h-4 w-4" aria-hidden="true" />
 Tìm kiếm
 </Button>
 </form>

 <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
 <Button asChild size="lg" className="bg-cta hover:bg-cta/90 text-white border-0 shadow-lg shadow-cta/20 px-8">
 <Link to={AUTH_ROUTES.TRIP_CREATE} className="gap-2">
 <Map className="h-4 w-4" aria-hidden="true" />
 Lập kế hoạch ngay
 </Link>
 </Button>
 <Button asChild variant="outline" size="lg" className="border-white/50 bg-background/10 text-white backdrop-blur-sm hover:bg-background hover:text-foreground px-8">
 <Link to={PUBLIC_ROUTES.COMMUNITY} className="gap-2">
 <MessageSquare className="h-4 w-4" aria-hidden="true" />
 Khám phá cộng đồng
 </Link>
 </Button>
 </div>
 </div>
 </section>

 <section className="border-b border-border py-16 ">
 <div className="container mx-auto max-w-7xl space-y-8 px-4 md:px-8">
 <SectionHeading
 title="Điểm đến nổi bật"
 description="Các địa điểm đang được xem và đánh giá nhiều nhất trên ezTravel."
 to={PUBLIC_ROUTES.EXPLORE}
 actionLabel="Khám phá tất cả"
 />
 {destinationsQuery.isLoading ? (
 <LoadingGrid count={6} />
 ) : destinationsQuery.isError ? (
 <SectionError message="Không thể tải điểm đến nổi bật." onRetry={destinationsQuery.refetch} />
 ) : destinations.length === 0 ? (
 <EmptyState title="Chưa có điểm đến nổi bật" description="Dữ liệu điểm đến sẽ xuất hiện khi hệ thống có nội dung phù hợp." icon={Compass} />
 ) : (
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
 {destinations.map((destination) => (
 <ExploreCard key={destination.id} item={destination} type="PLACE" />
 ))}
 </div>
 )}
 </div>
 </section>

 <section className="border-b border-border bg-background py-16 /40">
 <div className="container mx-auto max-w-7xl space-y-8 px-4 md:px-8">
 <SectionHeading
 title="Lịch trình được yêu thích"
 description="Những hành trình công khai nổi bật theo lượt thích, sao chép và lượt xem."
 to={PUBLIC_ROUTES.COMMUNITY}
 actionLabel="Xem lịch trình cộng đồng"
 />
 {tripsQuery.isLoading ? (
 <LoadingGrid count={4} />
 ) : tripsQuery.isError ? (
 <SectionError message="Không thể tải lịch trình nổi bật." onRetry={tripsQuery.refetch} />
 ) : trips.length === 0 ? (
 <EmptyState title="Chưa có lịch trình công khai" description="Các lịch trình được chia sẻ sẽ xuất hiện tại đây." icon={Map} />
 ) : (
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
 {trips.map((trip, index) => <TripCard key={trip.id ?? trip.tripId} trip={trip} index={index} />)}
 </div>
 )}
 </div>
 </section>

 <section className="bg-background py-16 /40">
 <div className="container mx-auto max-w-7xl space-y-8 px-4 md:px-8">
 <SectionHeading
 title="Bài viết mới nhất"
 description="Kinh nghiệm và câu chuyện du lịch mới được xuất bản trên ezTravel."
 to={PUBLIC_ROUTES.BLOGS}
 actionLabel="Đọc tất cả bài viết"
 />
 {blogsQuery.isLoading ? (
 <LoadingGrid count={4} />
 ) : blogsQuery.isError ? (
 <SectionError message="Không thể tải bài viết mới." onRetry={blogsQuery.refetch} />
 ) : blogs.length === 0 ? (
 <EmptyState title="Chưa có bài viết được xuất bản" description="Bài viết cộng đồng mới sẽ xuất hiện tại đây." icon={MessageSquare} />
 ) : (
 <div className="grid gap-5 lg:grid-cols-2">
 {blogs.map((blog) => <BlogCard key={blog.id ?? blog.maBaiViet} blog={blog} />)}
 </div>
 )}
 </div>
 </section>
 </div>
 );
}
