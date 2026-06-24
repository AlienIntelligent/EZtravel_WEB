import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Eye, MessageCircle, Send } from "lucide-react";
import {
 useCreateBlogCommentMutation,
 useGetBlogCommentsQuery,
 useGetBlogDetailsQuery,
} from "../../store/apis/communityApi";

const getTitle = (blog) => blog?.title ?? blog?.tieuDe ?? "Bai viet";
const getContent = (blog) => blog?.content ?? blog?.noiDung ?? "";
const getImage = (blog) => blog?.thumbnail ?? blog?.images?.[0] ?? "";
const getAuthor = (blog) => blog?.authorName ?? blog?.userName ?? "Traveler";
const getCommentContent = (comment) => comment.content ?? comment.noiDung ?? "";

const formatDate = (value) => {
 if (!value) return "";
 const date = new Date(value);
 if (Number.isNaN(date.getTime())) return "";
 return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
};

export default function BlogDetails() {
 const { id } = useParams();
 const blogId = Number(id);
 const [comment, setComment] = useState("");

 const {
 data: blog,
 isLoading,
 isError,
 refetch,
 } = useGetBlogDetailsQuery(blogId, { skip: Number.isNaN(blogId) });
 const { data: commentData = [] } = useGetBlogCommentsQuery(blogId, {
 skip: Number.isNaN(blogId),
 });
 const [createComment, { isLoading: isSubmitting }] = useCreateBlogCommentMutation();

 const comments = Array.isArray(commentData)
 ? commentData
 : commentData?.items ?? commentData?.data ?? blog?.comments ?? [];

 const handleSubmitComment = async (event) => {
 event.preventDefault();
 const content = comment.trim();
 if (!content || Number.isNaN(blogId)) return;

 await createComment({ id: blogId, body: { content } }).unwrap();
 setComment("");
 };

 if (isLoading) {
 return (
 <div className="container mx-auto max-w-4xl px-4 py-8">
 <div className="h-96 animate-pulse rounded-md border bg-muted/40" />
 </div>
 );
 }

 if (isError || !blog) {
 return (
 <div className="container mx-auto max-w-4xl px-4 py-8">
 <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
 Không thể tải bài viết.{" "}
 <button className="font-semibold underline" type="button" onClick={() => refetch()}>
 Thử lại
 </button>
 </div>
 </div>
 );
 }

 const image = getImage(blog);

 return (
 <div className="container mx-auto max-w-4xl px-4 py-8">
 <Link
 to="/community/blogs"
 className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
 >
 <ArrowLeft className="h-4 w-4" />
 Quay lại blog
 </Link>

 <article className="overflow-hidden rounded-md border bg-background shadow-sm">
 {image && <img src={image} alt={getTitle(blog)} className="h-72 w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop"; }} />}

 <div className="p-5 sm:p-8">
 <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
 <span>{getAuthor(blog)}</span>
 <span className="inline-flex items-center gap-1">
 <CalendarDays className="h-4 w-4" />
 {formatDate(blog.createdAt ?? blog.ngayTao)}
 </span>
 <span className="inline-flex items-center gap-1">
 <Eye className="h-4 w-4" />
 {blog.viewCount ?? blog.luotXem ?? 0}
 </span>
 <span className="inline-flex items-center gap-1">
 <MessageCircle className="h-4 w-4" />
 {comments.length}
 </span>
 </div>

 <h1 className="text-3xl font-bold leading-tight text-foreground">{getTitle(blog)}</h1>
 {blog.placeName && <p className="mt-2 text-sm font-medium text-primary">{blog.placeName}</p>}

 <div className="mt-6 whitespace-pre-line text-base leading-8 text-foreground">
 {getContent(blog)}
 </div>
 </div>
 </article>

 <section className="mt-8 rounded-md border bg-background p-5">
 <h2 className="text-lg font-bold text-foreground">Bình luận</h2>

 <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmitComment}>
 <textarea
 className="min-h-24 rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
 placeholder="Viết bình luận..."
 value={comment}
 onChange={(event) => setComment(event.target.value)}
 disabled={isSubmitting}
 />
 <button
 type="submit"
 className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
 disabled={!comment.trim() || isSubmitting}
 >
 <Send className="h-4 w-4" />
 Gửì bình luận
 </button>
 </form>

 <div className="mt-6 space-y-3">
 {comments.length === 0 ? (
 <p className="text-sm text-muted-foreground">Chưa có bình luận nào.</p>
 ) : (
 comments.map((item) => (
 <div key={item.id ?? item.maBinhLuan} className="rounded-md bg-muted/40 px-4 py-3">
 <div className="flex flex-wrap items-center justify-between gap-2">
 <span className="text-sm font-semibold text-foreground">
 {item.userName ?? item.authorName ?? "Traveler"}
 </span>
 <span className="text-xs text-muted-foreground">
 {formatDate(item.createdAt ?? item.ngayTao)}
 </span>
 </div>
 <p className="mt-2 text-sm leading-6 text-muted-foreground">{getCommentContent(item)}</p>
 </div>
 ))
 )}
 </div>
 </section>
 </div>
 );
}
