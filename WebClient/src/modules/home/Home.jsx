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
  useGetCommunityFeedQuery,
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
        <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-slate-50 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
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
      className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      aria-label={`Xem lịch trình ${title} trong cộng đồng`}
      state={{ tripId: id }}
    >
      <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-3 rounded bg-slate-950/75 px-2 py-1 text-xs font-medium text-white">
          {trip.authorName ?? trip.userName ?? "Traveler"}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-serif text-lg font-bold text-slate-950 group-hover:text-primary dark:text-slate-50">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description || "Một hành trình công khai được cộng đồng ezTravel chia sẻ."}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
        </div>
        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
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

function CommunityCard({ feed }) {
  const title = feed.tripName ?? feed.title ?? "Chuyến đi mới";
  const content = feed.content ?? feed.description ?? "";
  const author = feed.userName ?? feed.authorName ?? "Traveler";
  const initial = author.trim().charAt(0).toUpperCase() || "T";

  return (
    <Link
      to={PUBLIC_ROUTES.COMMUNITY}
      state={{ tripId: feed.id ?? feed.tripId }}
      className="group flex h-full flex-col rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center gap-3">
        {feed.avatar ?? feed.userAvatar ? (
          <img
            src={feed.avatar ?? feed.userAvatar}
            alt={author}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            {initial}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{author}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(feed.createdAt)}</p>
        </div>
      </div>
      <h3 className="mt-4 line-clamp-2 font-serif text-lg font-bold text-slate-950 group-hover:text-primary dark:text-slate-50">
        {title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {content || "Một hành trình mới vừa được chia sẻ với cộng đồng."}
      </p>
      <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" aria-hidden="true" />
          {formatNumber(feed.likeCount)}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
          {formatNumber(feed.commentCount)}
        </span>
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
      className="group grid overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-[12rem_1fr]"
    >
      {image ? (
        <img src={image} alt={title} className="h-44 w-full object-cover sm:h-full" />
      ) : (
        <div className="flex h-44 items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-800 sm:h-full">
          <Map className="h-8 w-8" aria-hidden="true" />
        </div>
      )}
      <div className="flex min-w-0 flex-col p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{blog.authorName ?? blog.userName ?? "Traveler"}</span>
          <span>{formatDate(blog.createdAt ?? blog.ngayTao)}</span>
        </div>
        <h3 className="mt-2 line-clamp-2 font-serif text-lg font-bold text-slate-950 group-hover:text-primary dark:text-slate-50">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {summary}
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
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
  const communityQuery = useGetCommunityFeedQuery();
  const blogsQuery = useGetBlogsQuery();

  const destinations = asList(destinationsQuery.data).slice(0, 6);
  const trips = asList(tripsQuery.data).slice(0, 4);
  const communityFeeds = asList(communityQuery.data).slice(0, 3);
  const blogs = asList(blogsQuery.data).slice(0, 4);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const keyword = searchQuery.trim();
    navigate(keyword ? `${PUBLIC_ROUTES.EXPLORE}?keyword=${encodeURIComponent(keyword)}` : PUBLIC_ROUTES.EXPLORE);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-950">
      <section className="relative flex min-h-[72svh] items-center overflow-hidden bg-slate-950 py-14 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45"
          style={{ backgroundImage: 'url("/images/bg_1.jpg")' }}
        />
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center md:px-8">
          <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">ezTravel</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
            Khám phá điểm đến, tham khảo lịch trình thật và bắt đầu chuyến đi của riêng bạn.
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
              className="min-h-11 flex-1 rounded-md border-0 bg-white px-4 text-sm text-slate-950 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" size="lg" className="gap-2">
              <Compass className="h-4 w-4" aria-hidden="true" />
              Tìm kiếm
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="text-white hover:text-white">
              <Link to={AUTH_ROUTES.TRIP_CREATE} className="gap-2 text-white hover:text-white">
                <Map className="h-4 w-4" aria-hidden="true" />
                Lập kế hoạch
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white bg-transparent text-white hover:bg-white hover:text-slate-950">
              <Link to={PUBLIC_ROUTES.COMMUNITY} className="gap-2">
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Xem cộng đồng
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-16 dark:border-slate-800">
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

      <section className="border-b border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/40">
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

      <section className="border-b border-slate-200 py-16 dark:border-slate-800">
        <div className="container mx-auto max-w-7xl space-y-8 px-4 md:px-8">
          <SectionHeading
            title="Mới từ cộng đồng"
            description="Cập nhật gần đây từ những traveler đang chia sẻ hành trình của họ."
            to={PUBLIC_ROUTES.COMMUNITY}
            actionLabel="Vào cộng đồng"
          />
          {communityQuery.isLoading ? (
            <LoadingGrid count={3} image={false} />
          ) : communityQuery.isError ? (
            <SectionError message="Không thể tải cập nhật cộng đồng." onRetry={communityQuery.refetch} />
          ) : communityFeeds.length === 0 ? (
            <EmptyState title="Cộng đồng đang chờ bài chia sẻ đầu tiên" description="Những lịch trình công khai mới nhất sẽ xuất hiện tại đây." icon={MessageSquare} />
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {communityFeeds.map((feed) => <CommunityCard key={feed.id ?? feed.tripId} feed={feed} />)}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900/40">
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
