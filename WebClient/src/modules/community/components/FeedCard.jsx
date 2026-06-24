import { useState } from "react";
import { Heart, MessageCircle, Send, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
 useCreateTripCommentMutation,
 useGetTripCommentsQuery,
 useLikeTripMutation,
} from "@/store/apis/communityApi";
import { useAppSelector } from "@/store/hooks";
import Swal from "sweetalert2";

export function FeedCard({ feed }) {
 const navigate = useNavigate();
 const [showComments, setShowComments] = useState(false);
 const [commentText, setCommentText] = useState("");
 
 const [likeTrip] = useLikeTripMutation();
 const [commentTrip, { isLoading: isCommenting }] = useCreateTripCommentMutation();

 const user = useAppSelector((state) => state.auth.user);
 const isAuthenticated = !!user;
 const tripId = Number(feed.id);

 const { data: comments = [], isLoading: isLoadingComments } =
 useGetTripCommentsQuery(tripId, {
 skip: !showComments || Number.isNaN(tripId),
 });

 const handleLike = async () => {
 if (!isAuthenticated) {
 Swal.fire("Yêu cầu đăng nhập", "Bạn cần đăng nhập để thích bài viết", "warning");
 return;
 }
 try {
 await likeTrip(tripId).unwrap();
 } catch {
 console.error("Like failed");
 }
 };

 const handleComment = async (e) => {
 e.preventDefault();
 if (!isAuthenticated) {
 Swal.fire("Yêu cầu đăng nhập", "Bạn cần đăng nhập để bình luận", "warning");
 return;
 }
 if (!commentText.trim()) return;

 try {
 await commentTrip({ tripId, content: commentText.trim() }).unwrap();
 setCommentText("");
 } catch {
 Swal.fire("Lỗi", "Không thể gửi bình luận", "error");
 }
 };

 const handleViewTrip = () => {
 navigate(`/trips/${tripId}`);
 };

 return (
 <article className="overflow-hidden rounded-md border border-border bg-background shadow-sm">
 <div className="p-5">
 <div className="mb-4 flex items-center gap-3">
 <Avatar>
 <AvatarFallback>{feed.userName?.charAt(0) || "U"}</AvatarFallback>
 </Avatar>
 <div className="min-w-0">
 <div className="truncate text-sm font-semibold text-foreground">{feed.userName || "Thành viên ezTravel"}</div>
 <div className="text-xs text-muted-foreground">
 {new Date(feed.createdAt).toLocaleDateString("vi-VN")}
 </div>
 </div>
 </div>
 
 <div className="mb-4">
 <h2 className="mb-2 line-clamp-2 text-lg font-bold text-foreground">{feed.tripName}</h2>
 <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">{feed.content}</p>
 </div>

 <div className="flex items-center justify-between border-t border-border pt-3">
 <div className="flex items-center gap-2">
 <Button 
 variant="ghost" 
 size="sm" 
 className={`flex items-center gap-1 ${feed.isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
 onClick={handleLike}
 aria-label={`Thích chuyến đi, hiện có ${feed.likeCount || 0} lượt thích`}
 >
 <Heart className={`h-4 w-4 ${feed.isLiked ? 'fill-current' : ''}`} aria-hidden="true" />
 <span>{feed.likeCount || 0}</span>
 </Button>
 <Button 
 variant="ghost" 
 size="sm" 
 className="flex items-center gap-1 text-muted-foreground"
 onClick={() => setShowComments(!showComments)}
 aria-expanded={showComments}
 >
 <MessageCircle className="h-4 w-4" aria-hidden="true" />
 <span>{feed.commentCount || 0}</span>
 </Button>
 </div>

 <Button 
 variant="ghost" 
 size="sm" 
 className="flex items-center gap-1 text-muted-foreground hover:text-blue-600"
 onClick={handleViewTrip}
 aria-label="Xem chi tiết chuyến đi"
 >
 <Eye className="h-4 w-4" aria-hidden="true" />
 <span>Xem chuyến đi</span>
 </Button>
 </div>
 </div>

 {showComments && (
 <div className="border-t border-border bg-background p-4">
 <div className="mb-4 max-h-60 space-y-3 overflow-y-auto">
 {isLoadingComments ? (
 <div className="text-sm text-muted-foreground">Đang tải bình luận...</div>
 ) : comments.length === 0 ? (
 <div className="text-sm text-muted-foreground">Chưa có bình luận nào.</div>
 ) : (
 comments.map((comment) => (
 <div key={comment.id} className="flex gap-2">
 <Avatar className="h-6 w-6">
 <AvatarFallback className="text-xs">{comment.userName?.charAt(0) || "U"}</AvatarFallback>
 </Avatar>
 <div className="flex-1 rounded-md bg-background p-2 text-sm">
 <span className="block text-xs font-semibold">{comment.userName || "Thành viên"}</span>
 {comment.content}
 </div>
 </div>
 ))
 )}
 </div>
 
 <form onSubmit={handleComment} className="flex gap-2">
 <Input 
 value={commentText}
 onChange={(e) => setCommentText(e.target.value)}
 placeholder="Viết bình luận..."
 className="flex-1"
 aria-label="Nội dung bình luận"
 />
 <Button type="submit" size="icon" disabled={isCommenting || !commentText.trim()} aria-label="Gửi bình luận" title="Gửi bình luận">
 <Send className="h-4 w-4" aria-hidden="true" />
 </Button>
 </form>
 </div>
 )}
 </article>
 );
}
