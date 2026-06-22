import { Link } from "react-router-dom";
import { Newspaper, PenLine } from "lucide-react";
import { useGetCommunityFeedQuery } from "@/store/apis/communityApi";
import { FeedCard } from "./components/FeedCard";
import { TopBloggersSidebar } from "./components/TopBloggersSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";

export default function CommunityWorkspace() {
  const { data: feeds = [], isLoading, isError } = useGetCommunityFeedQuery();
  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.user));

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-950">Cộng đồng ezTravel</h1>
          <p className="mt-2 text-sm text-slate-500">Chuyến đi và trải nghiệm từ cộng đồng.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/community/blogs">
              <Newspaper className="mr-2 h-4 w-4" aria-hidden="true" />
              Bài viết
            </Link>
          </Button>
          {isAuthenticated ? (
            <Button asChild>
              <Link to="/community/blogs/create">
                <PenLine className="mr-2 h-4 w-4" aria-hidden="true" />
                Viết bài
              </Link>
            </Button>
          ) : null}
        </div>
      </header>

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4 rounded-md border border-slate-200 bg-white p-5">
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
      ) : isError ? (
        <div className="border-l-4 border-rose-600 bg-rose-50 p-5 text-sm text-rose-800" role="alert">
          Đã có lỗi xảy ra khi tải danh sách cộng đồng.
        </div>
      ) : feeds.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
          Chưa có bài viết nào trong cộng đồng.
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div className="grid gap-5 md:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
            {feeds.map((feed) => (
              <FeedCard key={feed.id} feed={feed} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <TopBloggersSidebar />
          </div>
        </div>
      )}
    </main>
  );
}

