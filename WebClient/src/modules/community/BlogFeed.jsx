import { Link } from "react-router-dom";
import { CalendarDays, Eye, MessageCircle, PenLine } from "lucide-react";
import { useGetBlogsQuery } from "../../store/apis/communityApi";

const getBlogId = (blog) => blog.id ?? blog.maBaiViet;
const getTitle = (blog) => blog.title ?? blog.tieuDe ?? "Bai viet";
const getSummary = (blog) => blog.summary ?? blog.tomTat ?? blog.content ?? blog.noiDung ?? "";
const getImage = (blog) => blog.thumbnail ?? blog.images?.[0] ?? "";
const getAuthor = (blog) => blog.authorName ?? blog.userName ?? "Traveler";

const formatDate = (value) => {
 if (!value) return "";
 const date = new Date(value);
 if (Number.isNaN(date.getTime())) return "";
 return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(date);
};

export default function BlogFeed() {
 const { data = [], isLoading, isError, refetch } = useGetBlogsQuery();
 const blogs = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];

 return (
 <div className="container mx-auto w-full max-w-6xl px-4 py-8">
 <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
 <div>
 <h1 className="text-3xl font-bold text-foreground">Blog du lịch</h1>
 <p className="mt-2 text-sm text-muted-foreground">
 Kinh nghiệm, lịch trình và câu chuyện mới từ cộng đồng ezTravel.
 </p>
 </div>

 <Link
 to="/community/blogs/create"
 className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
 >
 <PenLine className="h-4 w-4" />
 Viết bài
 </Link>
 </div>

 {isLoading ? (
 <div className="grid gap-4 md:grid-cols-2">
 {[0, 1, 2, 3].map((item) => (
 <div key={item} className="h-56 animate-pulse rounded-md border bg-muted/40" />
 ))}
 </div>
 ) : isError ? (
 <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
 Không thể tải blog.{" "}
 <button className="font-semibold underline" type="button" onClick={() => refetch()}>
 Thử lại
 </button>
 </div>
 ) : blogs.length === 0 ? (
 <div className="rounded-md border bg-background px-4 py-12 text-center">
 <h2 className="text-lg font-semibold text-foreground">Chưa có bài blog nào</h2>
 <p className="mt-1 text-sm text-muted-foreground">Hãy là người đầu tiên chia sế hành trình của bạn.</p>
 </div>
 ) : (
 <div className="grid gap-5 md:grid-cols-2">
 {blogs.map((blog) => {
 const id = getBlogId(blog);
 const image = getImage(blog);

 return (
 <Link
 key={id}
 to={`/community/blogs/${id}`}
 className="group overflow-hidden rounded-md border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
 >
 {image ? (
 <img src={image} alt={getTitle(blog)} className="h-48 w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />
 ) : (
 <div className="flex h-48 items-center justify-center bg-muted text-sm text-muted-foreground">
 ezTravel
 </div>
 )}

 <div className="p-4">
 <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
 <span>{getAuthor(blog)}</span>
 <span className="inline-flex items-center gap-1">
 <CalendarDays className="h-3.5 w-3.5" />
 {formatDate(blog.createdAt ?? blog.ngayTao)}
 </span>
 </div>

 <h2 className="line-clamp-2 text-lg font-bold text-foreground group-hover:text-primary">
 {getTitle(blog)}
 </h2>
 <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
 {getSummary(blog)}
 </p>

 <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
 <span className="inline-flex items-center gap-1">
 <Eye className="h-3.5 w-3.5" />
 {blog.viewCount ?? blog.luotXem ?? 0}
 </span>
 <span className="inline-flex items-center gap-1">
 <MessageCircle className="h-3.5 w-3.5" />
 {blog.commentCount ?? 0}
 </span>
 {blog.placeName && <span>{blog.placeName}</span>}
 </div>
 </div>
 </Link>
 );
 })}
 </div>
 )}
 </div>
 );
}
