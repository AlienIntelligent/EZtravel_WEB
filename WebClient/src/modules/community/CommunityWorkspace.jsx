import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Eye, MessageCircle, PenLine, Map } from "lucide-react";
import { useGetCommunityFeedQuery, useGetBlogsQuery } from "@/store/apis/communityApi";
import { FeedCard } from "./components/FeedCard";
import { TopBloggersSidebar } from "./components/TopBloggersSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";
import Pagination from "@/shared/components/Pagination";

// --- Blog Helpers ---
const getBlogId = (blog) => blog.id ?? blog.maBaiViet;
const getTitle = (blog) => blog.title ?? blog.tieuDe ?? "Bài viết";
const getSummary = (blog) => blog.summary ?? blog.tomTat ?? blog.content ?? blog.noiDung ?? "";
const getImage = (blog) => blog.thumbnail ?? blog.images?.[0] ?? "";
const getAuthor = (blog) => blog.authorName ?? blog.userName ?? "Traveler";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(date);
};

export default function CommunityWorkspace() {
  const [activeTab, setActiveTab] = useState("blog"); // "blog" or "feed"
  const [blogPage, setBlogPage] = useState(1);
  const [feedPage, setFeedPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.user));
  
  // Queries
  const { data: feedsData = [], isLoading: isLoadingFeeds, isError: isErrorFeeds } = useGetCommunityFeedQuery(undefined, { skip: activeTab !== "feed" });
  const { data: blogsData = [], isLoading: isLoadingBlogs, isError: isErrorBlogs, refetch: refetchBlogs } = useGetBlogsQuery(undefined, { skip: activeTab !== "blog" });
  
  const feeds = Array.isArray(feedsData) ? feedsData : feedsData?.items ?? feedsData?.data ?? [];
  const blogs = Array.isArray(blogsData) ? blogsData : blogsData?.items ?? blogsData?.data ?? [];

  const paginatedBlogs = blogs.slice((blogPage - 1) * ITEMS_PER_PAGE, blogPage * ITEMS_PER_PAGE);
  const blogTotalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);

  const paginatedFeeds = feeds.slice((feedPage - 1) * ITEMS_PER_PAGE, feedPage * ITEMS_PER_PAGE);
  const feedTotalPages = Math.ceil(feeds.length / ITEMS_PER_PAGE);

  // Reset page when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background">
      {/* Hero Banner */}
      <div className="relative bg-slate-900 pt-16 pb-16 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=2070&auto=format&fit=crop" 
               alt="Community landscape" 
               className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto max-w-7xl flex flex-col items-center justify-center text-center gap-4">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-white drop-shadow-md">
              Cộng đồng ezTravel
            </h1>
            <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto drop-shadow-sm">
              Chia sẻ kinh nghiệm, lịch trình và câu chuyện từ những chuyến đi
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {isAuthenticated ? (
              <Button asChild className="bg-primary hover:bg-primary/90 text-white border-0 shadow-lg px-6">
                <Link to="/community/blogs/create" className="flex items-center gap-2">
                  <PenLine className="h-4 w-4" aria-hidden="true" />
                  Viết bài ngay
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-background border-b border-border py-3 px-4 md:px-8 sticky top-[64px] z-40 shadow-sm">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex gap-1.5 p-1 bg-muted rounded-lg text-sm w-full sm:w-auto">
              <button
                onClick={() => handleTabChange("blog")}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeTab === "blog" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Bài viết Blog
              </button>
              <button
                onClick={() => handleTabChange("feed")}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeTab === "feed" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Lịch trình chia sẻ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden bg-background">
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          
          {/* BLOG TAB */}
          {activeTab === "blog" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Bài viết cộng đồng</h2>
                  <p className="text-sm text-muted-foreground mt-1">Khám phá và chia sẻ những câu chuyện thú vị</p>
                </div>
                {isAuthenticated && (
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-sm">
                    <Link to="/community/blogs/create" className="flex items-center gap-2">
                      <PenLine className="h-4 w-4" aria-hidden="true" />
                      Viết bài
                    </Link>
                  </Button>
                )}
              </div>
              
              {isLoadingBlogs ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="h-56 animate-pulse rounded-md border bg-muted/40" />
                  ))}
                </div>
              ) : isErrorBlogs ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  Không thể tải blog.{" "}
                  <button className="font-semibold underline" type="button" onClick={() => refetchBlogs()}>
                    Thử lại
                  </button>
                </div>
              ) : blogs.length === 0 ? (
                <div className="rounded-md border bg-background px-4 py-12 text-center">
                  <h2 className="text-lg font-semibold text-foreground">Chưa có bài blog nào</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Hãy là người đầu tiên chia sẻ hành trình của bạn.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <div className="grid gap-5 md:grid-cols-2">
                    {paginatedBlogs.map((blog) => {
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
                  {blogTotalPages > 1 && (
                    <Pagination
                      currentPage={blogPage}
                      totalPages={blogTotalPages}
                      onPageChange={setBlogPage}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* FEED TAB */}
          {activeTab === "feed" && (
            <div>
              {isLoadingFeeds ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-4 md:col-span-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-4 rounded-md border border-border bg-background p-5">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-24 w-full" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 md:col-span-1">
                    <Skeleton className="h-48 w-full" />
                  </div>
                </div>
              ) : isErrorFeeds ? (
                <div className="border-l-4 border-rose-600 bg-rose-50 p-5 text-sm text-rose-800" role="alert">
                  Đã có lỗi xảy ra khi tải danh sách lịch trình.
                </div>
              ) : feeds.length === 0 ? (
                <div className="rounded-md border border-border bg-background p-10 text-center text-sm text-muted-foreground">
                  Chưa có lịch trình chia sẻ nào trong cộng đồng.
                </div>
              ) : (
                <div className="grid items-start gap-6 lg:grid-cols-3">
                  <div className="flex flex-col gap-8 lg:col-span-2 lg:grid-cols-1">
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
                      {paginatedFeeds.map((feed) => (
                        <FeedCard key={feed.id} feed={feed} />
                      ))}
                    </div>
                    {feedTotalPages > 1 && (
                      <Pagination
                        currentPage={feedPage}
                        totalPages={feedTotalPages}
                        onPageChange={setFeedPage}
                      />
                    )}
                  </div>
                  <div className="lg:col-span-1">
                    <TopBloggersSidebar />
                  </div>
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
