import { useGetTopBloggersQuery, useFollowUserMutation } from "../../../store/apis/communityApi";
import { useAppSelector } from "../../../store/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Loader2, ThumbsUp, BookOpen } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

export function TopBloggersSidebar() {
  const { data = [], isLoading, isError } = useGetTopBloggersQuery();
  const [followUser, { isLoading: isFollowingUser }] = useFollowUserMutation();
  const currentUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = !!currentUser;

  // Local state to track which bloggers the user has clicked "follow" on during the session
  const [followedStates, setFollowedStates] = useState({});

  const bloggers = Array.isArray(data) ? data : data?.data || [];

  const handleFollow = async (bloggerId) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Yêu cầu đăng nhập",
        text: "Bạn cần đăng nhập để theo dõi thành viên khác.",
        icon: "warning",
        confirmButtonText: "Đồng ý",
      });
      return;
    }

    if (currentUser.id === bloggerId) {
      Swal.fire({
        title: "Lỗi",
        text: "Bạn không thể tự theo dõi chính mình.",
        icon: "error",
        confirmButtonText: "Đóng",
      });
      return;
    }

    try {
      const response = await followUser(bloggerId).unwrap();
      
      // Update local state based on response
      setFollowedStates((prev) => ({
        ...prev,
        [bloggerId]: response.isFollowing || response.following,
      }));

      if (response.isFollowing || response.following) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Đã theo dõi",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: "Đã hủy theo dõi",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Lỗi",
        text: error?.data?.message || "Không thể thực hiện thao tác theo dõi.",
        icon: "error",
        confirmButtonText: "Đồng ý",
      });
    }
  };

  if (isLoading) {
    return (
      <aside className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-slate-900">Blogger hàng đầu</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-2 w-16 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  if (isError || bloggers.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-slate-900">Blogger hàng đầu</h3>
      <div className="space-y-4">
        {bloggers.map((blogger) => {
          const bloggerId = blogger.id || blogger.userId;
          const isSelf = currentUser && currentUser.id === bloggerId;
          const isFollowing = followedStates[bloggerId] ?? false;

          return (
            <div key={bloggerId} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={blogger.avatar || blogger.avatarUrl} />
                  <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold">
                    {blogger.name?.charAt(0) || blogger.userName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {blogger.name || blogger.userName || "Traveler"}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span className="flex items-center gap-0.5">
                      <BookOpen className="h-3 w-3" /> {blogger.postCount || blogger.blogCount || 0} bài
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <ThumbsUp className="h-3 w-3" /> {blogger.totalLikes || 0}
                    </span>
                  </div>
                </div>
              </div>

              {!isSelf && (
                <Button
                  size="sm"
                  variant={isFollowing ? "outline" : "default"}
                  className="h-8 px-3 text-xs"
                  onClick={() => handleFollow(bloggerId)}
                  disabled={isFollowingUser}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="mr-1 h-3.5 w-3.5" />
                      Đang theo
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-1 h-3.5 w-3.5" />
                      Theo dõi
                    </>
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
